<template>
  <el-drawer
    v-model="drawerVisible"
    size="60%"
    :with-header="false"
    @close="close"
  >
    <el-tabs v-model="tabName">
      <el-tab-pane label="日志" name="log">
        <DeployLog
          id="deployLog"
          ref="deployRef"
          :publish-id="publishId"
          :publish-status="publishStatus"
        />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
  import { publishAction } from '@/api/application'

  export default defineComponent({
    name: 'ServiceDeploy',
    components: {
      DeployLog: defineAsyncComponent(() => import('./PublishDeployLog')),
    },
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        tabName: 'log',
        publishId: 0,
        publishStatus: '',
        activeName: 'log',
        deployRef: null,
        drawerVisible: false,
      })

      const showPage = async (row, service) => {
        if (row.id && service) {
          if (service.status !== '1') {
            const { msg, data } = await publishAction({
              aid: row.id,
              sid: service.id,
            })
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            state.publishId = data
            state.publishStatus = '1'
          }
          state.drawerVisible = true
        }
      }

      const close = () => {
        state.deployRef.clearCurrentTerm()
        state.drawerVisible = false
        emit('fetch-data')
      }
      // const menuSave = async () => {
      //   const { msg } = await doMenuRoleSave({
      //     roleId: state.roleId.toString(),
      //     menuIds: state.treeMenuRef
      //       .getCheckedKeys(false)
      //       .map((item) => item.toString()),
      //   })
      //   $baseMessage(msg, 'success', 'vab-hey-message-success')
      // }
      // const apiSave = async () => {
      //   const { msg } = await doApiRoleSave({
      //     roleId: state.roleId.toString(),
      //     apiIds: state.treeApiRef
      //       .getCheckedKeys(false)
      //       .map((item) => item.toString()),
      //   })
      //   $baseMessage(msg, 'success', 'vab-hey-message-success')
      // }
      onMounted(() => {})
      return {
        ...toRefs(state),
        showPage,
        close,
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
