import { useRef, useState } from 'react';
import { getWarrior, deleteWarrior } from '@/api/index';
import type { WarriorItem } from '@/api/index';
import { Space, Cascader, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { EnumBranchStatus, EnumSex } from '@/enum/index';
import Form from './form';
import utils from '@/utils/util';
type FormQueryType = {
  created?: string[];
  current?: number;
  name?: string;
  phone?: number;
  belong_branch_id?: string;
  pageSize?: number;
  status?: string;
};
export default () => {
  const ref = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formData, setFormData] = useState<WarriorItem | undefined>();
  const [formMode, setFormMode] = useState<'read' | 'edit'>('edit');
  const columns: ProColumns<WarriorItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'id_card',
      renderFormItem: () => false,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      renderFormItem: () => false,
      valueEnum: {
        [EnumSex.female]: { text: '女' },
        [EnumSex.male]: { text: '男' },
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      renderFormItem: () => false,
    },
    {
      title: '所属网点',
      dataIndex: 'belong_branch_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueEnum: {
        [EnumBranchStatus.close]: { text: '关闭', status: 'Error' },
        [EnumBranchStatus.open]: { text: '营业中', status: 'Success' },
        [EnumBranchStatus.rest]: { text: '休息中', status: 'Default' },
      },
    },
    {
      title: '创建时间',
      width: 140,
      dataIndex: 'created',
      valueType: 'dateTimeRange',
      sorter: (a, b) => a.created - b.created,
      render: (_, entity) => new Date(entity.created).toLocaleString(),
      renderFormItem: () => false,
    },
    {
      title: '操作',
      width: 180,
      key: 'id',
      valueType: 'option',
      render: (id, record: WarriorItem) => [
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
            const res = await deleteWarrior([record?.id || '']);
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
    <ProTable<WarriorItem, FormQueryType>
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
                const res = await deleteWarrior(selectedRowKeys);
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
        return getWarrior({
          page: params.current,
          page_size: params.pageSize,
          name: params.name,
          phone: params.phone,
          belong_branch_id: params.belong_branch_id,
          status: params.status,
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
        title: '战士',
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
