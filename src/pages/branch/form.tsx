import { useRef } from 'react';
import { Button, message } from 'antd';
import provinceOptions from './city';
import type { FormInstance } from 'antd';
import { addBranch } from '@/api/index';
import type { BranchItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default (props) => {
  const { onClose } = props;
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<BranchItem>
      title="新建网点"
      formRef={formRef}
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
        const res = await addBranch(values);
        if (res.code != 0) {
          message.error(res.error);
          return false;
        }
        message.success('提交成功');
        // 不返回不会关闭弹框
        onClose();
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
        <ProFormText width="md" name="name" placeholder="请输入名称" />
      </ProForm.Group>
      <ProForm.Group label="地址">
        <ProFormSelect
          options={provinceOptions}
          width="sm"
          name="province"
          placeholder="请选择省"
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
              />
            );
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="address"
          width="xl"
          placeholder="请输入详细地址"
        />
      </ProForm.Group>
      <ProForm.Group label="费用详细">
        <ProFormText
          name="range"
          width="xs"
          label="服务范围半径（单位：千米）"
        />
        <ProFormText
          name="base_cost"
          width="xs"
          label="基础服务费（单位：元）"
        />
        <ProFormText
          name="extra_range_unit_price"
          width="xs"
          label="超出服务范围收费（单位：千米/元）"
        />
      </ProForm.Group>
      <ProForm.Group label="备注">
        <ProFormTextArea name="remark" width="xl" />
      </ProForm.Group>
      {/* <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          label="签约客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="contract"
          label="合同名称"
          placeholder="请输入名称"
        />
        <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]}
          width="xs"
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSelect
          width="xs"
          options={[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]}
          name="unusedMode"
          label="合同约定失效效方式"
        />
      </ProForm.Group>
      <ProFormText width="sm" name="id" label="主合同编号" />
      <ProFormText
        name="project"
        disabled
        label="项目名称"
        initialValue="xxxx项目"
      />
      <ProFormText
        width="xs"
        name="mangerName"
        disabled
        label="商务经理"
        initialValue="启途"
      /> */}
    </DrawerForm>
  );
};
