<template>
  <div class="role-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-date-picker
          v-model="queryForm.dateRange"
          end-placeholder="结束时间"
          range-separator="到"
          start-placeholder="开始时间"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          width="300px"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              clearable
              placeholder="请输入申请单名"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :data="list">
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table border :data="row.applications">
            <el-table-column
              align="center"
              label="服务名称"
              prop="name"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              label="gitProject"
              prop="gitProject"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              label="项目描述"
              prop="remark"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              label="发布状态"
              prop="status"
              show-overflow-tooltip
            >
              <template #default="scope">
                {{
                  scope.row.status === '0' || scope.row.status === ''
                    ? '待发布'
                    : scope.row.status === '1'
                    ? '发布中'
                    : scope.row.status === '2'
                    ? '发布成功'
                    : '发布失败'
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              show-overflow-tooltip
              width="200"
            >
              <template #default="scope">
                <el-button
                  v-show="scope.row.status !== '1'"
                  size="small"
                  type="primary"
                  @click="handleDeploy(row, scope.row)"
                >
                  发布
                </el-button>
                <el-button
                  v-show="scope.row.status === '1'"
                  size="small"
                  type="danger"
                  @click="handleDeployStop(row, scope.row)"
                >
                  停止
                </el-button>
                <el-button
                  size="small"
                  type="info"
                  @click="handleDeployHistory(row, scope.row)"
                >
                  发布记录
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="id"
        prop="id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        label="申请单名称"
        prop="applyTitle"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="发版类型"
        prop="applyType"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.applyType === '1' ? '正常发版' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发版环境"
        prop="env"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="申请单状态"
        prop="status"
        show-overflow-tooltip
      >
        <template #default="{ row }">{{ row.status }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="计划发版时间"
        prop="planPublishTime"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            @click="handleDeployComplete(row)"
          >
            完成发布
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
    <deploy ref="deployRef" @fetch-data="fetchData" />
    <servicePublishHistory ref="deployHistoryRef" />
  </div>
</template>

<script>
  import { getPublishList, publishStop } from '@/api/application'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'
  import { publishComplete } from '@/api/apply'

  export default defineComponent({
    name: 'ApplicationForm',
    components: {
      Deploy: defineAsyncComponent(() => import('./components/ServiceDeploy')),
      ServicePublishHistory: defineAsyncComponent(() =>
        import('./components/ServicePublishHistory')
      ),
    },
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        activeName: '发布',
        deployRef: null,
        deployHistoryRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          page: 1,
          pageSize: 10,
          name: '',
          candidate: '',
        },
      })
      const handleDeploy = (row, service) => {
        state.deployRef.showPage(row, service)
      }
      const handleDeployStop = async (row, service) => {
        const { msg } = await publishStop({ aid: row.id, sid: service.id })
        $baseMessage(msg, 'success', 'vab-hey-message-success')
      }
      // 完成确认
      const handleDeployComplete = async (row) => {
        const { msg } = await publishComplete(row.id)
        $baseMessage(msg, 'success', 'vab-hey-message-success')
      }
      const handleDeployHistory = (row, service) => {
        state.deployHistoryRef.handleShow(row, service)
      }
      const handleMoveFlow = (row) => {
        if (row.id) {
          state['editRef'].showEdit(row)
        }
      }
      const handleTabClick = (data) => {
        state.queryForm.page = 1
        state.activeName = data.paneName
        fetchData()
      }
      const handleSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.page = val
        fetchData()
      }
      const queryData = () => {
        state.queryForm.page = 1
        fetchData()
      }
      const fetchData = async () => {
        state.listLoading = true
        state.queryForm.status = state.activeName
        const {
          data: { list, total },
        } = await getPublishList(state.queryForm)
        state.list = list
        state.total = total
        state.listLoading = false
      }
      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleMoveFlow,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        fetchData,
        handleTabClick,
        handleDeployHistory,
        handleDeployComplete,
        handleDeploy,
        handleDeployStop,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>
