import { useEffect, useRef, useState } from 'react';
import { message, Input } from 'antd';
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
import TMap from '@/components/TMap';
type Prop = {
  visible: boolean;
  initialValues?: BranchItem;
  updateTable(): void;
  updateVisible(visable: boolean): void;
  mode: 'read' | 'edit';
};
const getdetailsAddress = (initialValues: BranchItem | undefined) => {
  if (!initialValues) return '';
  const { province = '', city = '', area = '', address = '' } = initialValues;
  return province + city + area + address;
};
export default (props: Prop) => {
  const { initialValues, visible, updateTable, updateVisible, mode } = props;
  const readOnly = mode == 'read';
  const formRef = useRef<FormInstance>();
  const [range, setRange] = useState(0);
  useEffect(() => {
    if (props.initialValues) {
      setRange(props.initialValues.range / 1000);
    } else {
      setRange(0);
    }
  }, [props.initialValues]);
  return (
    <DrawerForm<BranchItem>
      title={(readOnly ? '查看' : initialValues ? '修改' : '新增') + '网点'}
      formRef={formRef}
      visible={visible}
      omitNil={false}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              base_cost: utils.fen2yuan(initialValues.base_cost),
              extra_range_unit_price: utils.fen2yuan(
                initialValues.extra_range_unit_price,
              ),
              range: initialValues.range / 1000,
            }
          : {
              longitude: '',
              latitude: '',
              province: '',
              city: '',
              area: '',
              address: '',
            }
      }
      onVisibleChange={(visible) => {
        updateVisible(visible);
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
          range: _values.range * 1000,
          longitude: _values.longitude.toString(),
          latitude: _values.latitude.toString(),
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
        value.range && setRange(value.range);
        // // 省/市 清除选择的值的的联动
        // if (value.hasOwnProperty('province')) {
        //   formRef?.current?.setFieldsValue({
        //     city: '',
        //     area: '',
        //   });
        //   city = '';
        //   area = '';
        // }
        // if (value.hasOwnProperty('city')) {
        //   formRef?.current?.setFieldsValue({
        //     area: '',
        //   });
        //   area = '';
        // }
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
      <ProForm.Group label="地址">
        {visible && (
          <TMap
            detailsAddress={getdetailsAddress(initialValues)}
            range={range * 1000}
            lat={initialValues?.latitude}
            lng={initialValues?.longitude}
            readonly={readOnly}
            setDetailsAddress={(detailsAddress) => {
              formRef?.current?.setFieldsValue({
                province: detailsAddress.province,
                city: detailsAddress.city,
                area: detailsAddress.area,
                address: detailsAddress.address,
              });
            }}
            setLatLng={(lat, log) => {
              formRef?.current?.setFieldsValue({
                longitude: log,
                latitude: lat,
              });
            }}
          ></TMap>
        )}
      </ProForm.Group>
      <ProForm.Group label="地址信息（在地图上选择位置后自动填充）">
        <ProFormText
          width="md"
          label="经度"
          name="longitude"
          disabled={true}
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value) throw new Error('请在地图上选择网点位置');
              },
            },
          ]}
        />
        <ProFormText
          width="md"
          label="纬度"
          name="latitude"
          disabled={true}
          required
          rules={[
            {
              validator: async (_, value) => {
                if (!value) throw new Error('请在地图上选择网点位置');
              },
            },
          ]}
        />
        <ProFormDependency name={['city', 'area']}>
          {({ city, area }) => {
            return (
              <ProForm.Group>
                <ProFormText
                  width="xs"
                  name="province"
                  disabled={true}
                  required
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (!value) throw new Error('请在地图上选择网点位置');
                      },
                    },
                  ]}
                />
                {city && <ProFormText width="xs" name="city" disabled={true} />}
                {area && <ProFormText width="xs" name="area" disabled={true} />}
              </ProForm.Group>
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
      {/* 
        <ProFormSelect
          options={provinceOptions}
          width="sm"
          name="province"
          showSearch
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
                showSearch
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
                showSearch
                placeholder="请选择区"
                rules={[{ required: true, message: '请选择区' }]}
                readonly={readOnly}
              />
            );
          }}
        </ProFormDependency> */}

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
