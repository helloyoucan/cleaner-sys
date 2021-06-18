import { useRef, useState } from 'react';
import { getCoupon, deleteCoupon } from '@/api/index';
import type { CouponItem } from '@/api/index';
import { Space, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Form from './form';
import utils from '@/utils/util';
import {
  EnumCouponType,
  EnumCouponThreshold,
  EnumCouponExpiryType,
} from '@/enum';
type FormQueryType = {
  created?: string[];
  current?: number;
  pageSize?: number;
  name?: string;
  type?: number;
  threshold?: number;
  expiry_type?: number;
};
export default () => {
  const ref = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formData, setFormData] = useState<CouponItem | undefined>();
  const [formMode, setFormMode] = useState<'read' | 'edit'>('edit');
  const columns: ProColumns<CouponItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '总数量',
      dataIndex: 'total_amount',
    },
    {
      title: '剩余数量',
      dataIndex: 'amount',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        [EnumCouponType.amount]: { text: '指定金额' },
        [EnumCouponType.discount]: { text: '折扣' },
      },
    },
    {
      title: '使用门槛',
      dataIndex: 'threshold_type',
      valueEnum: {
        [EnumCouponThreshold.none]: { text: '无' },
        [EnumCouponThreshold.fixedAmount]: { text: '满足指定金额' },
        [EnumCouponThreshold.firstOrder]: { text: '用户首单' },
      },
    },
    {
      title: '有效期类型',
      dataIndex: 'expiry_type',
      valueEnum: {
        [EnumCouponExpiryType.fixedDate]: { text: '固定日期' },
        [EnumCouponExpiryType.afterGet]: { text: '领取当日开始N天内有效' },
      },
    },
    {
      title: '创建时间',
      width: 140,
      dataIndex: 'created',
      valueType: 'dateTimeRange',
      sorter: (a, b) => a.created - b.created,
      render: (_, entity) => new Date(entity.created).toLocaleString(),
    },
    {
      title: '操作',
      width: 180,
      key: 'id',
      valueType: 'option',
      render: (id, record: CouponItem) => [
        <a
          key="link"
          onClick={() => {
            setFormData(record);
            setFormMode('read');
            setDrawerVisible(true);
          }}
        >
          查看
        </a>,
        <a
          key="link2"
          onClick={() => {
            setFormData(record);
            setDrawerVisible(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="link3"
          title="删除这条数据?"
          placement="left"
          onConfirm={async () => {
            const res = await deleteCoupon([record?.id || '']);
            if (res.code != 0) return message.error(res.error);
            message.success('删除成功');
            ref?.current?.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <ProTable<CouponItem, FormQueryType>
      actionRef={ref}
      columns={columns}
      rowSelection={{}}
      tableAlertRender={({
        selectedRowKeys,
        selectedRows,
        onCleanSelected,
      }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
        return (
          <Space size={16}>
            <Popconfirm
              key="link3"
              title={`删除选中的${selectedRowKeys.length}条数据?`}
              placement="left"
              onConfirm={async () => {
                const res = await deleteCoupon(selectedRowKeys);
                if (res.code != 0) return message.error(res.error);
                message.success(`${res.data}条删除成功`);
                ref?.current?.reload();
                onCleanSelected();
              }}
              okText="确定"
              cancelText="取消"
            >
              <a>批量删除</a>
            </Popconfirm>
          </Space>
        );
      }}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        return getCoupon({
          page: params.current,
          page_size: params.pageSize,
          name: params.name,
          created_start_time: utils.dateTime2time(params.created?.[0]),
          created_end_time: utils.dateTime2time(params.created?.[1]),
        }).then((res) => {
          if (res.code != 0) {
            return {
              data: [],
              success: false,
            };
          }
          return {
            data: res.data?.list,
            success: true,
            total: res.data.pages.total,
          };
        });
      }}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        pageSize: 10,
      }}
      search={{
        defaultCollapsed: true,
      }}
      dateFormatter="string"
      toolbar={{
        title: '优惠券',
      }}
      options={{ fullScreen: true }}
      toolBarRender={() => [
        <Form
          mode={formMode}
          visible={drawerVisible}
          initialValues={formData}
          updateVisible={(visible) => {
            setDrawerVisible(visible);
            if (!visible) {
              setFormData(undefined);
              setFormMode('edit');
            }
          }}
          updateTable={() => ref?.current?.reload()}
        ></Form>,
      ]}
    />
  );
};
