<template>
  <div class="role-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="待审核" name="测试审核" />
          <el-tab-pane label="待验收" name="验收" />
          <el-tab-pane label="已审核" name="发布" />
          <el-tab-pane label="已完成" name="完成" />
        </el-tabs>
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
        width="100"
      >
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleMoveFlow(row)">
            流转
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
    <edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getList } from '@/api/apply'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ApplicationForm',
    components: {
      Edit: defineAsyncComponent(() => import('./components/ApplicationForm')),
    },
    setup() {
      const state = reactive({
        activeName: '测试审核',
        editRef: null,
        editConfigRef: null,
        relativeRef: null,
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
        } = await getList(state.queryForm)
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
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>
