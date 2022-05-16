<template>
  <el-drawer v-model="drawerVisible" :with-header="false" @close="close">
    <el-tabs v-model="tabName">
      <el-tab-pane label="菜单权限" name="menu">
        <el-button type="primary" @click="menuSave">确 定</el-button>
        <el-tree
          ref="treeMenuRef"
          :data="menuData"
          default-expand-all
          highlight-current
          node-key="id"
          show-checkbox
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <span>{{ data.meta.title }}</span>
            </span>
          </template>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="API权限" name="api">
        <el-button type="primary" @click="apiSave">确 定</el-button>
        <el-tree
          ref="treeApiRef"
          :data="apiData"
          default-expand-all
          highlight-current
          node-key="id"
          show-checkbox
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <span>{{ data.description }}</span>
            </span>
          </template>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
  import { getApiTree, doApiRoleSave } from '@/api/apiManagement'
  import { getMenuTree, doMenuRoleSave } from '@/api/menuManagement'

  export default defineComponent({
    name: 'RoleRelativeResources',
    // emits: ['fetch-data'],
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        tabName: 'menu',
        menuData: [],
        apiData: [],
        treeMenuRef: null,
        treeApiRef: null,
        activeName: 'menu',
        roleId: 0,
        drawerVisible: false,
      })
      const showEdit = (row) => {
        if (row.id) {
          state.roleId = row.id
          state.drawerVisible = true
        }
      }

      const close = () => {
        state.roleId = 0
        state.drawerVisible = false
      }
      const fetchApiData = async () => {
        const {
          data: { list },
        } = await getApiTree()
        state.apiData = list
      }
      const fetchMenuData = async () => {
        const {
          data: { list },
        } = await getMenuTree()
        state.menuData = list
      }
      const menuSave = async () => {
        const { msg } = await doMenuRoleSave({
          roleId: state.roleId.toString(),
          menuIds: state.treeMenuRef
            .getCheckedNodes(false, true)
            .map((item) => item.id.toString()),
        })
        $baseMessage(msg, 'success', 'vab-hey-message-success')
      }
      const apiSave = async () => {
        const { msg } = await doApiRoleSave({
          roleId: state.roleId.toString(),
          apiIds: state.treeApiRef
            .getCheckedNodes(false, true)
            .map((item) => item.id.toString()),
        })
        $baseMessage(msg, 'success', 'vab-hey-message-success')
      }
      onMounted(() => {
        fetchMenuData()
        fetchApiData()
      })
      return {
        ...toRefs(state),
        showEdit,
        close,
        menuSave,
        apiSave,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vab-tree-border {
    width: 100%;
    height: 250px;
    padding: $base-padding;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: $base-border-radius;
  }
</style>
