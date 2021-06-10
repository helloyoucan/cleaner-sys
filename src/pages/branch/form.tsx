import { useRef } from 'react';
import { Button, message, Row, Col } from 'antd';
import provinceOptions from './city';
import type { FormInstance } from 'antd';
import { addBranch, updateBranch } from '@/api/index';
import type { BranchItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
type Prop = {
  visible: boolean;
  initialValues?: BranchItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<BranchItem>
      title="新建网点"
      formRef={formRef}
      visible={visible}
      initialValues={initialValues}
      onVisibleChange={(visible) => updateVisible(visible)}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建网点
        </Button>
      }
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        let res;
        if (initialValues) {
          res = await updateBranch({ ...initialValues, ...values });
        } else {
          res = await addBranch(values);
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
      onValuesChange={(_, values) => {
        // 省/市 清除选择的值的的联动
        if (!values.province) {
          formRef?.current?.setFieldsValue({
            city: null,
            area: null,
          });
        }
        if (!values.city) {
          formRef?.current?.setFieldsValue({
            area: null,
          });
        }
      }}
    >
      <ProForm.Group label="网点名称">
        <ProFormText
          width="md"
          name="name"
          placeholder="请输入名称"
          disabled={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="地址">
        <ProFormSelect
          options={provinceOptions}
          width="sm"
          name="province"
          placeholder="请选择省"
          fieldProps={{
            optionItemRender(item) {
              return item.value;
            },
          }}
          disabled={readOnly}
        />
        <ProFormDependency name={['province']}>
          {({ province }) => {
            if (!province) return null;
            const cityOptions =
              provinceOptions.find((item) => item.value === province)
                ?.children || [];
            if (cityOptions.length == 0) return null;
            return (
              <ProFormSelect
                options={cityOptions}
                width="sm"
                name="city"
                placeholder="请选择城市"
                disabled={readOnly}
              />
            );
          }}
        </ProFormDependency>
        <ProFormDependency name={['province', 'city']}>
          {({ province, city }) => {
            if (!city) return null;
            const cityOptions: any =
              provinceOptions.find((item) => item.value === province)
                ?.children || [];
            if (cityOptions.length == 0) return null;
            const areaOptions =
              cityOptions.find((item) => item.value === city)?.children || [];
            if (areaOptions.length == 0) return null;
            return (
              <ProFormSelect
                options={areaOptions}
                width="sm"
                name="area"
                placeholder="请选择地区"
                disabled={readOnly}
              />
            );
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="address"
          width="xl"
          placeholder="请输入详细地址"
          disabled={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="费用详细">
        <ProFormText
          name="range"
          width="xs"
          label="服务范围半径（单位：千米）"
          disabled={readOnly}
        />
        <ProFormText
          name="base_cost"
          width="xs"
          label="基础服务费（单位：元）"
          disabled={readOnly}
        />
        <ProFormText
          name="extra_range_unit_price"
          width="xs"
          label="超出服务范围收费（单位：千米/元）"
          disabled={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="备注">
        <ProFormTextArea name="remark" width="xl" disabled={readOnly} />
      </ProForm.Group>
      <ProForm.Group label="战士长">
        <Row>
          <Col span={24}>
            <ProFormText
              width="md"
              name="warrior_manager_id"
              label="请选择战士长"
              disabled={readOnly}
            />
          </Col>
          <Col span={24}>
            <ProFormText
              width="md"
              name="contact_person"
              label="网点联系人"
              tooltip="根据选择的战士长自动填充"
              disabled={readOnly}
            />
          </Col>
          <Col span={24}>
            <ProFormText
              width="md"
              name="contact_phone"
              label="网点联系电话"
              tooltip="根据选择的战士长自动填充"
              disabled={readOnly}
            />
          </Col>
        </Row>
      </ProForm.Group>
    </DrawerForm>
  );
};
