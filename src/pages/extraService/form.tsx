import { useRef } from 'react';
import { Button, message } from 'antd';
import type { FormInstance } from 'antd';
import { addExtraService, updateExtraService } from '@/api/index';
import type { ExtraServiceItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { EnumExtraServiceStatus } from '@/enum/index';
import { debounce } from 'lodash';
import utils from '@/utils/util';
type Prop = {
  visible: boolean;
  initialValues?: ExtraServiceItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
const DefaultinitialValues = {
  discount: 100,
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<
      ExtraServiceItem & {
        start_time: string;
        end_time: string;
      }
    >
      title={(readOnly ? '查看' : initialValues ? '修改' : '新增') + '附加服务'}
      formRef={formRef}
      visible={visible}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              unit_price: utils.fen2yuan(initialValues.unit_price),
            }
          : DefaultinitialValues
      }
      onVisibleChange={(visible) => updateVisible(visible)}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建附加服务
        </Button>
      }
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onFinish={async (_values) => {
        if (readOnly) return true;
        let res;
        const values: ExtraServiceItem = {
          ..._values,
          unit_price: utils.yuan2fen(_values.unit_price),
          discount: +_values.discount,
        };
        if (initialValues) {
          res = await updateExtraService({ ...initialValues, ...values });
        } else {
          res = await addExtraService(values);
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
      onValuesChange={(value: ExtraServiceItem, values) => {}}
    >
      <ProForm.Group label="附加服务名称">
        <ProFormText
          width="md"
          name="name"
          readonly={readOnly}
          rules={[{ required: true, message: '请输入附加服务名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group label="费用">
        <ProFormText
          name="unit_price"
          width="xs"
          label="单价（单位：元）"
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0) throw new Error('请输入单价');
                if (isNaN(value)) throw new Error('请输入正确的单价!');
                if (value < 0) throw new Error('请输入大于0的数字');
              },
            },
          ]}
          readonly={readOnly}
        />
        <ProFormText
          name="discount"
          width="xs"
          label="折扣（0~100）"
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0) throw new Error('请输入折扣');
                if (isNaN(value) && (value < 0 || value > 100))
                  throw new Error('请输入正确的单价!');
                if (value < 0) throw new Error('请输入大于0的数字');
              },
            },
          ]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="状态">
        <ProFormSelect
          initialValue={initialValues ? undefined : 0}
          options={[
            {
              value: EnumExtraServiceStatus.disable,
              label: '禁用',
            },
            {
              value: EnumExtraServiceStatus.enable,
              label: '启用',
            },
          ]}
          width="sm"
          name="status"
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="备注">
        <ProFormTextArea name="remark" width="xl" readonly={readOnly} />
      </ProForm.Group>
    </DrawerForm>
  );
};
