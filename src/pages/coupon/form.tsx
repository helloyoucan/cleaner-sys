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
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import util from '@/utils/util';
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
      <ProForm.Group label="可领取时间">
        <ProFormDateTimePicker
          name="start_time"
          width="md"
          label="开始时间"
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
          label="结束时间"
          rules={[
            {
              required: true,
              message: '请选择结束时间',
            },
          ]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="描述">
        <ProFormTextArea name="description" width="xl" readonly={readOnly} />
      </ProForm.Group>
    </DrawerForm>
  );
};
