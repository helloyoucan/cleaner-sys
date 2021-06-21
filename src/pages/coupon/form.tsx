import { useRef } from 'react';
import { Button, message } from 'antd';
import type { FormInstance } from 'antd';
import { addCoupon, updateCoupon } from '@/api/index';
import type { CouponItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormDependency,
  ProFormRadio,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import util from '@/utils/util';
import {
  EnumCouponType,
  EnumCouponThresholdType,
  EnumCouponExpiryType,
} from '@/enum';
type Prop = {
  visible: boolean;
  initialValues?: CouponItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
const DeafultValues = {
  type: EnumCouponType.amount,
  threshold_type: EnumCouponThresholdType.none,
  expiry_type: EnumCouponExpiryType.fixedDate,
  issued_amount: 0,
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<
      CouponItem & {
        start_time: string;
        end_time: string;
      }
    >
      title={(readOnly ? '查看' : initialValues ? '修改' : '新增') + '优惠券'}
      formRef={formRef}
      visible={visible}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              type_value:
                initialValues.type === EnumCouponType.amount
                  ? util.fen2yuan(initialValues.type_value)
                  : initialValues.type_value,
              threshold_value: initialValues.threshold_value
                ? initialValues.threshold_type ===
                  EnumCouponThresholdType.fixedAmount
                  ? util.fen2yuan(initialValues.threshold_value)
                  : +initialValues.threshold_value
                : initialValues.threshold_value,
            }
          : DeafultValues
      }
      onVisibleChange={(visible) => updateVisible(visible)}
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onValuesChange={(value: CouponItem, values) => {
        if (value.type != undefined) {
          formRef?.current?.setFieldsValue({ type_value: null });
        }
        if (value.threshold_type != undefined) {
          formRef?.current?.setFieldsValue({ threshold_value: null });
        }
        if (value.expiry_type != undefined) {
          formRef?.current?.setFieldsValue({
            expiry_type_value: null,
            start_time: null,
            end_time: null,
          });
        }
      }}
      onFinish={async (_values) => {
        if (readOnly) return true;
        let res;
        const type_value =
          _values.type === EnumCouponType.amount
            ? util.yuan2fen(_values.type_value)
            : +_values.type_value;
        let threshold_value;
        if (_values.threshold_value) {
          threshold_value =
            _values.threshold_type === EnumCouponThresholdType.fixedAmount
              ? util.yuan2fen(_values.threshold_value)
              : +_values.threshold_value;
        }
        const expiry_type_value =
          _values.expiry_type === EnumCouponExpiryType.afterGet &&
          _values.expiry_type_value
            ? +_values.expiry_type_value
            : undefined;
        const start_time =
          _values.expiry_type === EnumCouponExpiryType.fixedDate
            ? util.dateTime2time(_values.start_time)
            : undefined;
        const end_time =
          _values.expiry_type === EnumCouponExpiryType.fixedDate
            ? util.dateTime2time(_values.end_time)
            : undefined;
        const values: CouponItem = {
          ..._values,
          total_amount: +_values.total_amount,
          type_value,
          threshold_value,
          expiry_type_value,
          start_time,
          end_time,
        };
        if (initialValues) {
          res = await updateCoupon({ ...initialValues, ...values });
        } else {
          res = await addCoupon(values);
        }
        if (res.code != 0) {
          message.error(res.error);
          return false;
        }
        message.success('提交成功');
        // 不返回不会关闭弹框
        updateTable();
        return true;
      }}
    >
      <ProForm.Group label="优惠券名称">
        <ProFormText
          width="md"
          name="name"
          readonly={readOnly}
          rules={[{ required: true, message: '请输入优惠券名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          label="总数量"
          width="md"
          name="total_amount"
          readonly={readOnly}
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0)
                  throw new Error('请输入优惠券数量');
                if (isNaN(value)) throw new Error('请输入数字');
                if (value < 0) throw new Error('请输入大于0的数字');
                if (value < formRef.current?.getFieldValue('issued_amount'))
                  throw new Error('不能小于被领取的数量');
              },
            },
          ]}
        />
        {initialValues && (
          <ProFormText
            label="已被领取"
            width="md"
            name="issued_amount"
            readonly={true}
          />
        )}
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          label="类型"
          options={[
            { value: EnumCouponType.amount, label: '指定金额' },
            { value: EnumCouponType.discount, label: '折扣' },
          ]}
          width="md"
          name="type"
          readonly={readOnly}
        />
        <ProFormDependency name={['type']}>
          {({ type }) => {
            const rules: any[] = [];
            let label = '';
            if (type == EnumCouponType.amount) {
              label = '指定金额';
              rules.push({
                validator: async (_, value) => {
                  if (!value || value.length == 0)
                    throw new Error('请输入指定金额');
                  if (isNaN(value)) throw new Error('请输入数字');
                  if (value < 0) throw new Error('请输入大于0的数字');
                },
              });
            }
            if (type == EnumCouponType.discount) {
              label = '折扣(1-100)';
              rules.push({
                validator: async (_, value) => {
                  if (!value || value.length == 0)
                    throw new Error('请输入折扣');
                  if (isNaN(value)) throw new Error('请输入数字');
                  if (value < 1 || value > 100)
                    throw new Error('请输入1-100的折扣');
                },
              });
            }
            return (
              <ProFormText
                width="md"
                name="type_value"
                readonly={readOnly}
                required
                label={label}
                rules={rules}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          label="使用门槛"
          options={[
            { value: EnumCouponThresholdType.none, label: '无' },
            {
              value: EnumCouponThresholdType.fixedAmount,
              label: '满足指定金额',
            },
            { value: EnumCouponThresholdType.firstOrder, label: '用户首单' },
          ]}
          width="md"
          name="threshold_type"
          readonly={readOnly}
        />
        <ProFormDependency name={['threshold_type']}>
          {({ threshold_type }) => {
            if (threshold_type === EnumCouponThresholdType.fixedAmount) {
              return (
                <ProFormText
                  width="md"
                  name="threshold_value"
                  readonly={readOnly}
                  required
                  label="指定金额"
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (!value || value.length == 0)
                          throw new Error('请输入指定金额');
                        if (isNaN(value)) throw new Error('请输入数字');
                        if (value < 0) throw new Error('请输入大于0的数字');
                      },
                    },
                  ]}
                />
              );
            }
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          label="有效期类型"
          options={[
            { value: EnumCouponExpiryType.fixedDate, label: '固定日期' },
            {
              value: EnumCouponExpiryType.afterGet,
              label: '领取当日开始N天内有效',
            },
          ]}
          width="md"
          name="expiry_type"
          readonly={readOnly}
        />
        <ProFormDependency name={['expiry_type']}>
          {({ expiry_type }) => {
            if (expiry_type === EnumCouponExpiryType.afterGet) {
              return (
                <ProFormText
                  width="md"
                  name="expiry_type_value"
                  readonly={readOnly}
                  required
                  label="天数"
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (!value || value.length == 0)
                          throw new Error('请输入天数');
                        if (isNaN(value)) throw new Error('请输入数字');
                        if (value < 0) throw new Error('请输入大于0的数字');
                      },
                    },
                  ]}
                />
              );
            }
          }}
        </ProFormDependency>
      </ProForm.Group>

      <ProFormDependency name={['expiry_type']}>
        {({ expiry_type }) => {
          if (expiry_type === EnumCouponExpiryType.fixedDate) {
            return (
              <ProForm.Group label="有效期时间">
                <ProFormDateTimePicker
                  name="start_time"
                  width="md"
                  label="生效时间"
                  rules={[
                    {
                      required: true,
                      message: '请选择生效时间',
                    },
                  ]}
                  readonly={readOnly}
                />
                <ProFormDateTimePicker
                  name="end_time"
                  width="md"
                  label="失效时间"
                  rules={[
                    {
                      required: true,
                      message: '请选择失效时间',
                    },
                  ]}
                  readonly={readOnly}
                />{' '}
              </ProForm.Group>
            );
          }
        }}
      </ProFormDependency>

      <ProForm.Group label="使用说明">
        <ProFormTextArea name="description" width="xl" readonly={readOnly} />
      </ProForm.Group>
    </DrawerForm>
  );
};
