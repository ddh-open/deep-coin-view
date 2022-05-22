<template>
  <div class="workbench-container">
    <el-row :gutter="20">
      <el-col :lg="4" :md="8" :sm="24" :xl="8" :xs="24">
        <vab-card shadow="hover">
          <template #header>分组列表</template>
          <el-tree
            ref="groupTree"
            :data="groupList"
            default-expand-all
            :expand-on-click-node="false"
            node-key="id"
            @current-change="nodeCurrentChange"
            @node-collapse="nodeExpand"
            @node-expand="nodeExpand"
          >
            <template #default="{ data }">
              <span class="custom-tree-node">
                <vab-icon
                  :icon="
                    data.expanded ||
                    data.children === null ||
                    data.children.length === 0
                      ? 'folder-line'
                      : 'folder-open-line'
                  "
                />
                <span>{{ data.name }} ({{ data.hostNum }})</span>
              </span>
            </template>
          </el-tree>
        </vab-card>
      </el-col>
      <el-col :lg="20" :md="16" :sm="24" :xl="16" :xs="24">
        <vab-card shadow="hover">
          <vab-query-form>
            <vab-query-form-left-panel :span="12">
              <el-button
                :icon="Plus"
                type="primary"
                @click="handleEdit($event)"
              >
                添加
              </el-button>
              <el-button
                :icon="Refresh"
                type="success"
                @click="handleCheck($event)"
              >
                验证
              </el-button>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel :span="12">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input
                    v-model.trim="queryForm.username"
                    clearable
                    placeholder="请输入检索"
                    @keyup.enter="queryData"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryData">查询</el-button>
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
          >
            <el-table-column
              label="主机名称"
              prop="name"
              show-overflow-tooltip
            />
            <el-table-column label="主机IP" prop="ip" show-overflow-tooltip />
            <el-table-column label="端口" prop="port" show-overflow-tooltip />
            <el-table-column label="状态" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag
                  class="ml-2"
                  :type="row.status === 'running' ? 'success' : 'danger'"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="验证" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag class="ml-2" :type="row.check ? 'success' : 'danger'">
                  {{ row.check ? '已验证' : '未验证' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="remark" show-overflow-tooltip />
            <el-table-column label="操作" show-overflow-tooltip width="260">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleShell(row)"
                >
                  调试
                </el-button>
                <el-button size="small" type="info" @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <!-- <el-image
                  class="vab-data-empty"
                  :src="require('@/assets/empty_images/data_empty.png')"
                /> -->
              <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
          </el-table>
        </vab-card>
      </el-col>
    </el-row>
    <vab-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      show-fullscreen
      :title="title"
      width="70%"
    >
      <xterm-shell
        :id="title"
        ref="xtermShellRef"
        :ip="ip"
        :port="port"
        :user="user"
      />
    </vab-dialog>
  </div>
</template>

<script>
  import { Refresh, Plus, Search } from '@element-plus/icons-vue'
  import { getGroupTree, getHostList } from '@/api/host'

  export default defineComponent({
    name: 'CmdbHost',
    components: {
      VabDialog: defineAsyncComponent(() => import('@/plugins/VabDialog')),
      XtermShell: defineAsyncComponent(() => import('./components/xtermShell')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        editRef: null,
        dialogVisible: false,
        title: '',
        ip: '',
        port: '',
        user: '',
        xtermShellRef: null,
        treeCurrentNode: 0,
        groupTree: null,
        list: [],
        groupList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          id: 1,
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row.id) {
          state['editRef'].showEdit(row)
        } else {
          state['editRef'].showEdit()
        }
      }
      const handleShell = (row) => {
        if (row.id) {
          state.title = row.ip
          state.ip = row.ip
          state.port = row.port
          state.user = row.user
          state.dialogVisible = true
        }
      }
      const handleCheck = (row) => {
        if (row.id) {
          state['editRef'].showEdit(row)
        } else {
          state['editRef'].showEdit()
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
      const queryData = () => {
        fetchData()
      }
      const nodeExpand = (data) => {
        data.expanded = !data.expanded
      }
      const nodeCurrentChange = (data) => {
        state.treeCurrentNode = data.id
      }
      const fetchData = async () => {
        state.listLoading = true
        const {
          data: { hosts },
        } = await getHostList(state.queryForm)
        state.list = hosts
        state.listLoading = false
      }
      const fetchGroupTreeData = async () => {
        const {
          data: { list },
        } = await getGroupTree()
        state.groupList = list
      }
      onMounted(async () => {
        await fetchGroupTreeData()
        nextTick(() => {
          state.groupTree.setCurrentKey(state.groupList[0].id, true)
        })
        if (state.groupList.length > 0) {
          state.queryForm.id = state.groupList[0].id
          await fetchData()
        }
      })

      return {
        ...toRefs(state),
        setSelectRows,
        handleEdit,
        handleDelete,
        queryData,
        fetchData,
        handleCheck,
        nodeExpand,
        nodeCurrentChange,
        handleShell,
        Refresh,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss">
  /* 改变被点击节点背景颜色，字体颜色 */
  .el-tree-node:focus > .el-tree-node__content {
    background-color: $base-color-primary !important;
    color: $base-color-background !important;
  }
  /*节点失焦时的背景颜色*/
  .el-tree-node.is-current.is-focusable > .el-tree-node__content {
    background-color: $base-color-primary !important;
    color: $base-color-background !important;
    & > .el-icon.el-tree-node__expand-icon {
      color: $base-color-background;
    }
  }
</style>
