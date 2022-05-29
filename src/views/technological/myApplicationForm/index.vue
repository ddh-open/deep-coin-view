<template>
  <div class="role-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleEdit($event)">
          添加
        </el-button>
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
        <template #default="{ row }">待 {{ row.status }}</template>
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
          <el-button size="small" type="info" @click="handleEdit(row)">
            编辑
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
  import { doDelete, getList } from '@/api/apply'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'MyApplicationForm',
    components: {
      Edit: defineAsyncComponent(() =>
        import('./components/MyApplicationForm')
      ),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
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
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row, copy) => {
        if (row.id) {
          state['editRef'].showEdit(row, copy)
        } else {
          state['editRef'].showEdit()
        }
      }
      const handleAddEnv = (row, service) => {
        if (row.id) {
          state['editConfigRef'].showEdit(row, service)
        } else {
          state['editConfigRef'].showEdit(row, service)
        }
      }
      const handleRelativeRole = (row) => {
        if (row.id) {
          state['relativeRef'].showEdit(row)
        }
      }
      const handleDelete = (row) => {
        if (row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete(row.id)
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const ids = state.selectRows.map((item) => item.id).join()
            $baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              await fetchData()
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
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
        setSelectRows,
        handleEdit,
        handleAddEnv,
        handleRelativeRole,
        handleDelete,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        fetchData,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>
