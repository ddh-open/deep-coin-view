<template>
  <div class="menu-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" type="primary" @click="handleEdit()">
            添加
          </el-button>
        </vab-query-form-top-panel>
      </vab-query-form>
      <el-table
        v-loading="listLoading"
        border
        :data="list"
        default-expand-all
        row-key="path"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="标题" prop="meta.title" show-overflow-tooltip />
        <el-table-column label="name" prop="name" show-overflow-tooltip />
        <el-table-column label="路径" prop="path" show-overflow-tooltip />
        <el-table-column label="隐藏" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.meta.hidden ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="始终显示" show-overflow-tooltip width="100">
          <template #default="{ row }">
            {{ row.meta.levelHidden ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="文件路径"
          prop="component"
          show-overflow-tooltip
        />
        <el-table-column label="重定向" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.redirect || '无' }}
          </template>
        </el-table-column>
        <el-table-column label="图标" show-overflow-tooltip>
          <template #default="{ row }">
            <vab-icon v-if="row.meta.icon" :icon="row.meta.icon" />
          </template>
        </el-table-column>
        <el-table-column label="固定" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.meta.noClosable ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="无缓存" show-overflow-tooltip width="120">
          <template #default="{ row }">
            {{ row.meta.noKeepAlive ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="badge" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.meta.badge" effect="dark" type="danger">
              {{ row.meta.badge }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="dot" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.meta.dot ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="260">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(row, 'addChild')"
            >
              新增子菜单
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
          <!-- <el-image
            class="vab-data-empty"
            :src="require('@/assets/empty_images/data_empty.png')"
          /> -->
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </vab-card>
    <edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/menuManagement'
  import { Plus } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'MenuManagement',
    components: {
      Edit: defineAsyncComponent(() =>
        import('./components/MenuManagementEdit')
      ),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        editRef: null,
        list: [],
        listLoading: true,
      })

      const handleEdit = (row, method) => {
        if (row && row.path) {
          state['editRef'].showEdit(row, method)
        } else {
          state['editRef'].showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.path) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            await fetchData()
          })
        }
      }
      const fetchData = async (role) => {
        state.listLoading = true
        const {
          data: { list },
        } = await getList({ role })
        state.list = list
        state.listLoading = false
      }
      const handleNodeClick = ({ role }) => {
        fetchData(role)
      }
      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleEdit,
        handleDelete,
        fetchData,
        handleNodeClick,
        Plus,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
