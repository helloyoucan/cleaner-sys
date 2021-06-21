import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import provinceOptions from '@/utils/city';
import type { FormInstance } from 'antd';
import { addBranch, updateBranch } from '@/api/index';
import { getLocationIp } from '@/api/index';
import type { BranchItem } from '@/api/index';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { EnumBranchStatus } from '@/enum';
import utils from '@/utils/util';
import BaiduMap from '@/components/BaiduMap';
type Prop = {
  visible: boolean;
  initialValues?: BranchItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
type LocationDataType = {
  latitude: string;
  longitude: string;
  province: string;
  city: string;
  area: string;
  address: string;
};
/**
 * 获取地址信息
 * @returns
 */
const getLocationData = async () => {
  const res = await getLocationIp();
  if (res.code == 0) {
    const { point, address_detail } = res.data.content;
    return {
      longitude: point.x,
      latitude: point.y,
      province: address_detail.province,
      city: address_detail.city,
      area: address_detail.district,
      address: address_detail.street,
    };
  }
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const [locationData, setLocationData] = useState<LocationDataType>();
  useEffect(() => {
    getLocationData().then((locationData: LocationDataType | undefined) => {
      locationData && setLocationData(locationData);
    });
  }, []);
  const formRef = useRef<FormInstance>();
  return (
    <DrawerForm<BranchItem>
      title={(readOnly ? '查看' : initialValues ? '修改' : '新增') + '网点'}
      formRef={formRef}
      visible={visible}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              base_cost: utils.fen2yuan(initialValues.base_cost),
              extra_range_unit_price: utils.fen2yuan(
                initialValues.extra_range_unit_price,
              ),
            }
          : {
              ...locationData,
            }
      }
      onVisibleChange={(visible) => {
        updateVisible(visible);
        if (visible) {
        }
      }}
      drawerProps={{
        forceRender: false,
        destroyOnClose: true,
      }}
      onFinish={async (_values) => {
        if (readOnly) return true;
        let res;
        const values = {
          ..._values,
          base_cost: utils.yuan2fen(_values.base_cost),
          extra_range_unit_price: utils.yuan2fen(
            _values.extra_range_unit_price,
          ),
        };
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
      onValuesChange={(value: BranchItem, values) => {
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
          readonly={readOnly}
          rules={[{ required: true, message: '请输入网点名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group label="地址">
        <BaiduMap
          latitude={initialValues?.latitude || locationData?.latitude}
          longitude={initialValues?.longitude || locationData?.longitude}
        />
        {initialValues && readOnly && (
          <>
            <ProFormText
              width="xl"
              label="经度"
              name="longitude"
              readonly={true}
            />
            <ProFormText
              width="xl"
              label="纬度"
              name="latitude"
              readonly={true}
            />
          </>
        )}
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
          placeholder="详细地址"
          rules={[{ required: true, message: '请输入详细地址' }]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="费用详细">
        <ProFormText
          name="range"
          width="xs"
          label="服务范围半径（单位：千米）"
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0)
                  throw new Error('请输入服务范围半径');
                if (isNaN(value)) throw new Error('请输入正确的服务范围半径');
                if (value < 0) throw new Error('请输入大于0的数字');
              },
            },
          ]}
          readonly={readOnly}
        />
        <ProFormText
          name="base_cost"
          width="xs"
          label="基础服务费（单位：元）"
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0)
                  throw new Error('请输入基础服务费');
                if (isNaN(value)) throw new Error('请输入正确的基础服务费');
                if (value < 0) throw new Error('请输入大于0的数字');
              },
            },
          ]}
          readonly={readOnly}
        />
        <ProFormText
          name="extra_range_unit_price"
          width="xs"
          label="超出服务范围收费（单位：千米/元）"
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length == 0)
                  throw new Error('请输入超出服务范围收费');
                if (isNaN(value))
                  throw new Error('请输入正确的超出服务范围收费');
                if (value < 0) throw new Error('请输入大于0的数字');
              },
            },
          ]}
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="备注">
        <ProFormTextArea name="remark" width="xl" readonly={readOnly} />
      </ProForm.Group>
      <ProForm.Group label="网点状态">
        <ProFormSelect
          initialValue={initialValues ? undefined : 0}
          options={[
            {
              value: EnumBranchStatus.close,
              label: '关闭',
            },
            {
              value: EnumBranchStatus.open,
              label: '营业中',
            },
            {
              value: EnumBranchStatus.rest,
              label: '休息中',
            },
          ]}
          width="sm"
          name="status"
          readonly={readOnly}
        />
      </ProForm.Group>
      <ProForm.Group label="战士长">
        <ProFormText
          width="sm"
          name="warrior_manager_id"
          label="请选择战士长"
          readonly={readOnly}
        />
        <ProFormText
          width="xs"
          name="contact_person"
          label="网点联系人"
          tooltip="根据选择的战士长自动填充"
          readonly={readOnly}
        />
        <ProFormText
          width="sm"
          name="contact_phone"
          label="网点联系电话"
          tooltip="根据选择的战士长自动填充"
          readonly={readOnly}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
