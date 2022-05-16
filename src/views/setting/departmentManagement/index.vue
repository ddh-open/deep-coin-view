<template>
  <div class="department-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleEdit($event)">
          添加
        </el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete($event)">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              clearable
              placeholder="请输入名称"
              @keyup.enter="queryData"
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

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      default-expand-all
      row-key="id"
      :tree-props="{ children: 'children' }"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="vab-table-expand">
            <div v-for="(item, index) in row.users" :key="index">
              <div>
                <span class="vab-table-expand-title">用户名:</span>
                {{ item.username }}
              </div>
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteUser(row, item.id, item.username)"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" show-overflow-tooltip width="90" />
      <el-table-column label="名称" prop="name" show-overflow-tooltip />
      <el-table-column
        label="父节点名称"
        prop="parentName"
        show-overflow-tooltip
      />
      <el-table-column label="排序" prop="sort" show-overflow-tooltip />
      <el-table-column label="描述" prop="remark" show-overflow-tooltip />
      <el-table-column
        label="创建时间"
        prop="createdAt"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleAddUser(row)">
            添加用户
          </el-button>
          <el-button size="small" type="info" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
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
    <AddUser ref="addUserRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, doDeleteUser, getList } from '@/api/departmentManagement'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DepartmentManagement',
    components: {
      Edit: defineAsyncComponent(() =>
        import('./components/DepartmentManagementEdit')
      ),
      AddUser: defineAsyncComponent(() => import('./components/AddUser')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        editRef: null,
        addUserRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          page: 1,
          pageSize: 10,
          title: '',
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row.id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleAddUser = (row) => {
        if (row.id) {
          state.addUserRef.showEdit(row)
        } else {
          state.addUserRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id.toString() })
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
      const handleDeleteUser = (row, userId, username) => {
        if (userId) {
          $baseConfirm(
            '你确定要删除' + row.name + '关联的' + username + '用户吗',
            null,
            async () => {
              const { msg } = await doDeleteUser({
                groupId: row.id,
                userIds: [userId],
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              await fetchData()
            }
          )
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
        handleAddUser,
        handleDeleteUser,
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

<style scoped lang="scss">
  .vab-table-expand {
    & > div {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
  }
</style>
