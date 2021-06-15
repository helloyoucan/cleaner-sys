import { useRef } from 'react';
import { Button, message } from 'antd';
import provinceOptions from '@/utils/city';
import type { FormInstance } from 'antd';
import {
  addWarrior,
  getAllBranch,
  updateWarrior,
  uploadPath,
} from '@/api/index';
import type { WarriorItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDependency,
  ProFormTextArea,
  ProFormUploadDragger,
  ProFormRadio,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { EnumSex, EnumWarriorStatus } from '@/enum';
import utils from '@/utils/util';
type Prop = {
  visible: boolean;
  initialValues?: WarriorItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
const DefaultinitialValues = {
  belong_branch_id: '',
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<WarriorItem>
      title={(readOnly ? '查看' : initialValues ? '修改' : '新增') + '战士'}
      formRef={formRef}
      visible={visible}
      initialValues={
        initialValues
          ? {
              ...initialValues,
            }
          : DefaultinitialValues
      }
      onVisibleChange={(visible) => updateVisible(visible)}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建战士
        </Button>
      }
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onFinish={async (_values) => {
        let res;
        const values = {
          ..._values,
        };
        if (initialValues) {
          res = await updateWarrior({ ...initialValues, ...values });
        } else {
          res = await addWarrior(values);
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
      onValuesChange={(value: WarriorItem, values: WarriorItem) => {
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
        if (!values.domicile_province) {
          formRef?.current?.setFieldsValue({
            city: null,
            domicile_city: null,
          });
        }
        if (!values.domicile_city) {
          formRef?.current?.setFieldsValue({
            domicile_area: null,
          });
        }
        if (value.id_card && utils.checkIdCard(value.id_card)) {
          formRef?.current?.setFieldsValue({
            sex: utils.getSexByIdcard(value.id_card),
            birthday: utils.getBirthdayByIdcard(value.id_card),
          });
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          label="姓名"
          width="md"
          name="name"
          readonly={readOnly}
          rules={[{ required: true, message: '请输入姓名' }]}
        />
        <ProFormDatePicker
          label="出生时间"
          tooltip="输入身份证号码自动填写"
          width="md"
          name="birthday"
          readonly={true}
        />
        <ProFormRadio.Group
          label="性别"
          tooltip="输入身份证号码自动填写"
          width="md"
          name="sex"
          readonly={true}
          options={[
            { label: '男', value: EnumSex.male },
            { label: '女', value: EnumSex.female },
          ]}
        />
        {initialValues && (
          <ProFormText
            label="加入时间"
            width="md"
            name="join_time"
            readonly={true}
          />
        )}
        <ProFormText
          label="联系电话"
          width="md"
          name="phone"
          readonly={readOnly}
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProFormText
          label="身份证号码"
          width="md"
          name="id_card"
          readonly={readOnly}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (!value || value.length == 0) {
                  throw new Error('请输入身份证号码');
                }
                if (!utils.checkIdCard(value)) {
                  throw new Error('请输入正确的身份证号码');
                }
              },
            },
          ]}
        />
        <ProFormUploadDragger
          label="身份证正面"
          fieldProps={{
            name: 'file',
            headers: { contentType: 'multipart/form-data' },
            maxCount: 1,
            onChange: ({ file }) => {
              if (file.status == 'done') {
                formRef?.current?.setFieldsValue({
                  id_card_image_front: file.response.data,
                });
              }
            },
          }}
          rules={[{ required: true, message: '请上传身份证正面' }]}
          action={uploadPath}
        >
          {initialValues?.id_card_image_front ? (
            <img
              src={initialValues.id_card_image_front}
              style={{ width: '100%' }}
            />
          ) : (
            ''
          )}
        </ProFormUploadDragger>
        <ProFormUploadDragger
          label="身份证反面"
          name="id_card_image_behind"
          fieldProps={{
            name: 'file',
            headers: { contentType: 'multipart/form-data' },
            maxCount: 1,
          }}
          rules={[{ required: true, message: '请上传身份证反面' }]}
          action={uploadPath}
        />
      </ProForm.Group>
      <ProForm.Group label="户籍地址">
        <ProFormSelect
          options={provinceOptions}
          width="sm"
          name="domicile_province"
          placeholder="请选择省/市"
          rules={[{ required: true, message: '请选择省' }]}
          fieldProps={{
            optionItemRender(item) {
              return item.value;
            },
          }}
          readonly={readOnly}
        />
        <ProFormDependency name={['domicile_province']}>
          {({ domicile_province }) => {
            if (!domicile_province) return null;
            const cityOptions =
              provinceOptions.find((item) => item.value === domicile_province)
                ?.children || [];
            if (cityOptions.length == 0) return null;
            return (
              <ProFormSelect
                options={cityOptions}
                width="sm"
                name="domicile_city"
                placeholder="请选择市/区"
                rules={[{ required: true, message: '请选择市' }]}
                readonly={readOnly}
              />
            );
          }}
        </ProFormDependency>
        <ProFormDependency name={['domicile_province', 'domicile_city']}>
          {({ domicile_province, domicile_city }) => {
            if (!domicile_city) return null;
            const cityOptions: any =
              provinceOptions.find((item) => item.value === domicile_province)
                ?.children || [];
            if (cityOptions.length == 0) return null;
            const areaOptions =
              cityOptions.find((item) => item.value === domicile_city)
                ?.children || [];
            if (areaOptions.length == 0) return null;
            return (
              <ProFormSelect
                options={areaOptions}
                width="sm"
                name="domicile_area"
                placeholder="请选择区"
                rules={[{ required: true, message: '请选择区' }]}
                readonly={readOnly}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group label="居住地址">
        <ProFormSelect
          options={provinceOptions}
          width="sm"
          name="province"
          placeholder="请选择省/市"
          rules={[{ required: true, message: '请选择省' }]}
          fieldProps={{
            optionItemRender(item) {
              return item.value;
            },
          }}
          readonly={readOnly}
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
                placeholder="请选择市/区"
                rules={[{ required: true, message: '请选择市' }]}
                readonly={readOnly}
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
                placeholder="请选择区"
                rules={[{ required: true, message: '请选择区' }]}
                readonly={readOnly}
              />
            );
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="address"
          width="xl"
          placeholder="详细居住地址"
          rules={[{ required: true, message: '请输入详细居住地址' }]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="备注">
        <ProFormTextArea name="remark" width="xl" readonly={readOnly} />
      </ProForm.Group>
      <ProForm.Group label="账号状态">
        <ProFormSelect
          initialValue={initialValues ? undefined : 0}
          options={[
            {
              value: EnumWarriorStatus.disable,
              label: '禁用',
            },
            {
              value: EnumWarriorStatus.enable,
              label: '启用',
            },
          ]}
          width="sm"
          name="status"
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="所属网点">
        <ProFormSelect
          request={async () => {
            const res = await getAllBranch();
            return [
              ...(res.code == 0
                ? res.data.map((item) => ({ label: item.name, value: item.id }))
                : []),
              { label: '无', value: '' },
            ];
          }}
          width="lg"
          name="belong_branch_id"
          readonly={readOnly}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
