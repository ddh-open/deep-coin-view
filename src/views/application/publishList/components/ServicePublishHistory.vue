<template>
  <el-drawer
    v-model="drawerVisible"
    size="60%"
    :with-header="false"
    @close="close"
  >
    <el-table v-loading="listLoading" border :data="list">
      <el-table-column
        align="center"
        label="id"
        prop="id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        label="发布环境"
        prop="env"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="发版状态"
        prop="status"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{
            row.status === 0
              ? '待发布'
              : row.status === 1
              ? '发布中'
              : row.status === 2
              ? '发布成功'
              : '发布失败'
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发版开始时间"
        prop="createdAt"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="发版结束时间"
        prop="updatedAt"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleHistoryLog(row)">
            查看日志
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <!--  <el-image
          class="vab-data-empty"
          :src="require('@/assets/empty_images/data_empty.png')"
        /> -->
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-drawer
      v-model="drawerVisible2"
      size="50%"
      :with-header="false"
      @close="closeHistory"
    >
      <DeployLog
        id="deployHistoryLog"
        ref="deployRef"
        :publish-id="publishId"
        :publish-logs="publishLogs"
        :publish-status="publishStatus"
      />
    </el-drawer>
  </el-drawer>
</template>

<script>
  import { publishHistory } from '@/api/application'

  export default defineComponent({
    name: 'ServicePublishHistory',
    components: {
      DeployLog: defineAsyncComponent(() => import('./PublishDeployLog')),
    },
    setup() {
      const state = reactive({
        publishId: '0',
        publishLogs: '',
        publishStatus: 0,
        drawerVisible: false,
        drawerVisible2: false,
        deployRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          page: 1,
          pageSize: 10,
          sid: 0,
          env: '',
        },
      })
      const handleShow = (row, service) => {
        state.queryForm.env = row.env
        state.queryForm.sid = service.id
        fetchData()
        state.drawerVisible = true
      }
      const handleHistoryLog = (row) => {
        state.publishId = row.id
        state.publishLogs = row.publishLog
        state.publishStatus = row.status
        state.drawerVisible2 = true
      }
      const handleSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.page = val
        fetchData()
      }
      const closeHistory = () => {
        state.drawerVisible2 = false
        state.deployRef.clearCurrentTerm()
      }
      const queryData = () => {
        state.queryForm.page = 1
        fetchData()
      }
      const fetchData = async () => {
        state.listLoading = true
        const {
          data: { list, total },
        } = await publishHistory(state.queryForm)
        state.list = list
        state.total = total
        state.listLoading = false
      }
      return {
        ...toRefs(state),
        handleSizeChange,
        handleCurrentChange,
        queryData,
        fetchData,
        handleHistoryLog,
        closeHistory,
        handleShow,
      }
    },
  })
</script>
