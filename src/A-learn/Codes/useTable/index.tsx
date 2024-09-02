/**
 * @description 列表专用多功能hook
 */

import React from 'react';
import { useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { PaginationProps } from 'antd/lib/pagination';
import { TableRowSelection } from 'antd/lib/table/interface';

/**
 * 自定义配置类型
 */
interface LocalOptions {
  /**
   * 此方法为兼容返回非标准数据的列表接口
   * @param res 接口返回的列表数据
   * @returns 标准列表数据
   */
  transData?: (res: any) => API.PaginationData<any>;
  /**
   * 自定义初始化的分页器参数
   */
  customizePagination?: PaginationProps;
  /**
   * 列表行的key，默认为id
   */
  rowKey?: string;
  /**
   * 是否分页
   */
  isPagination?: boolean;
}

/**
 * 默认自定义配置
 */
const defaultOption: LocalOptions = {
  isPagination: true,
  transData: ({ results, totalCount, pageNum, pageSize }) => {
    return { results, totalCount, pageNum, pageSize };
  },
};

interface UseTableRes<TableParams, ResultItem> {
  /**
   * 将常用默认值打包，方便使用，建议传给Table传props时，先解构此参数，这样可以省去大量传参
   * <Table {...defaultTableProps}></Table>
   */
  defaultTableProps: any;
  /**
   * 列表加载中参数
   */
  loading: boolean;
  /**
   * 分页器state
   */
  pagination: PaginationProps;
  /**
   * 分页器setPagination
   */
  setPagination: (pagination: any) => void;
  /**
   * 数据state
   */
  dataSource: ResultItem[];
  /**
   * 设置数据state方法
   */
  setDataSource: (dataSource: ResultItem[]) => void;
  /**
   * 筛选参数state
   */
  tableParams: TableParams;
  /**
   * 设置筛选参数state方法
   */
  setTableParams: (tableParams: TableParams) => void;
  /**
   * 强制更新当前页
   */
  forceFetch: () => void;
  /**
   * Table属性onChange回调方法
   */
  paginationChangeHandler: (tablePagination, filters?: any, sorter?: any, extra?: any) => void;
  /**
   * 已选行数据state，配合rowSelection值使用
   */
  selectRows: ResultItem[];
  /**
   * Table属性rowSelection值
   */
  rowSelection: TableRowSelection<ResultItem>;
}

/**
 * 列表专用多功能hook
 * @param func 列表接口
 * @param initTableParams 列表接口筛选用参数
 * @param options 自定义配置
 */
export default function useTable<TableParams, ResultItem>(
  func: API.Pagination<TableParams, any> | API.Normal<TableParams, any>,
  initTableParams?: TableParams,
  options?: LocalOptions
): UseTableRes<TableParams, ResultItem> {
  options = options ? { ...defaultOption, ...options } : defaultOption;

  const { transData, customizePagination = {}, rowKey = 'id', isPagination } = options;

  const initPagination = {
    total: 0,
    pageSize: 20,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ ...initPagination, ...customizePagination });

  const [tableParams, setTableParams] = useState<TableParams>(
    initTableParams ? initTableParams : null
  );
  const [dataSource, setDataSource] = useState([]);
  const [selectRows, setSelectRows] = useState([]);
  const [selectRowKeys, setSelectRowKeys] = useState([]);

  const fetchPromiseRef = useRef(Promise.resolve());

  const forceFetch = () => {
    fetchData(pagination);
  };

  const fetchData = async ({ current, pageSize }) => {
    if (isPagination) {
      try {
        setLoading(true);
        const res = await func({
          ...tableParams,
          pageNum: current,
          pageSize,
        });
        const { results, totalCount, pageNum, pageSize: resultsPageSize } = transData(res.data);

        if (current === 1 || (current > 1 && results && results.length)) {
          setDataSource(results ? results : []);
          setPagination({
            ...pagination,
            total: totalCount || 0,
            pageSize: resultsPageSize || pageSize,
            current: pageNum || 1,
          });
        } else {
          return fetchData({ current: 1, pageSize });
        }
      } catch (error) {
        console.log(error);
        setLoading(false); // 遇到 Table 组件的 loading 问题，先这样写
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }
    } else {
      setLoading(true);
      const { data } = await (func as API.Normal<TableParams, any>)({
        ...tableParams,
      });
      setDataSource(data ? data : []);
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  };

  const handlePaginationChange = async (...args) => {
    const [tablePagination, filters, sorter, extra] = args;
    if (!extra || extra.action === 'paginate') {
      // 翻页清空选中
      setSelectRowKeys([]);
      return fetchData(tablePagination);
    }
  };

  (initTableParams ? useEffect : useUpdateEffect)(() => {
    fetchPromiseRef.current = fetchPromiseRef.current.then(() =>
      fetchData({ current: 1, pageSize: pagination.pageSize })
    );
  }, [tableParams]);

  return {
    forceFetch,
    loading,
    pagination: isPagination ? pagination : null,
    setPagination,
    dataSource,
    setDataSource,
    tableParams,
    setTableParams,
    paginationChangeHandler: handlePaginationChange,
    selectRows,
    rowSelection: {
      selectedRowKeys: selectRowKeys,
      onChange(selectRowKeys, selectRows) {
        setSelectRowKeys(selectRowKeys);
        setSelectRows(selectRows);
      },
    },
    defaultTableProps: {
      rowKey,
      outlineBordered: true,
      loading,
      pagination: isPagination ? pagination : false,
      dataSource,
      footer: isPagination ? () => <></> : null,
      onChange: handlePaginationChange,
    },
  };
}
