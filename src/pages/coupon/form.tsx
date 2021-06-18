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
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import util from '@/utils/util';
import {
  EnumCouponType,
  EnumCouponThreshold,
  EnumCouponExpiryType,
} from '@/enum';
type Prop = {
  visible: boolean;
  initialValues?: CouponItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
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
      initialValues={initialValues}
      onVisibleChange={(visible) => updateVisible(visible)}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建优惠券
        </Button>
      }
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onFinish={async (_values) => {
        if (readOnly) return true;
        let res;
        const values: CouponItem = {
          ..._values,
          start_time: util.dateTime2time(_values.start_time),
          end_time: util.dateTime2time(_values.end_time),
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
      <ProForm.Group label="总数量">
        <ProFormText
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
              },
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          label="类型"
          options={[
            { value: EnumCouponType.amount, label: '指定金额' },
            { value: EnumCouponType.discount, label: '折扣' },
          ]}
          width="sm"
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
                    throw new Error('请输入1到100的折扣');
                },
              });
            }
            return (
              <ProFormText
                width="md"
                name="type_value"
                readonly={readOnly}
                required
                label
                rules={rules}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          label="使用门槛"
          options={[
            { value: EnumCouponThreshold.none, label: '无' },
            { value: EnumCouponThreshold.fixedAmount, label: '满足指定金额' },
            { value: EnumCouponThreshold.firstOrder, label: '用户首单' },
          ]}
          width="sm"
          name="threshold_type"
          readonly={readOnly}
        />
        <ProFormDependency name={['threshold_type']}>
          {({ threshold_type }) => {
            if (threshold_type === EnumCouponThreshold.fixedAmount) {
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
                      },
                    },
                  ]}
                />
              );
            }
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group label="可领取时间">
        <ProFormDateTimePicker
          name="start_time"
          width="md"
          label="生效时间"
          rules={[
            {
              required: true,
              message: '请选择开始时间',
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
              message: '请选择结束时间',
            },
          ]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="使用说明">
        <ProFormTextArea name="description" width="xl" readonly={readOnly} />
      </ProForm.Group>
    </DrawerForm>
  );
};
