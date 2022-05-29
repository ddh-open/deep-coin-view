<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="环境名称" prop="env">
        <el-input v-model="form.env" />
      </el-form-item>
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="名称空间" prop="namespace">
        <el-input v-model="form.namespace" />
      </el-form-item>
      <el-form-item label="构建job" prop="buildJob">
        <el-input v-model="form.buildJob" />
      </el-form-item>
      <el-form-item label="分支" prop="branch">
        <el-select v-model="form.branch" placeholder="请选择分支">
          <el-option
            v-for="item in branchList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAddConfig, doEditConfig } from '@/api/application'

  export default defineComponent({
    name: 'ServiceConfigManagementEdit',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        currentService: {},
        branchList: [],
        formRef: null,
        form: {
          name: '',
          remark: '',
          namespace: '',
          branch: '',
          env: '',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入服务名称' },
          ],
          buildJob: [
            { required: true, trigger: 'blur', message: '请输入构建job名' },
          ],
          env: [{ required: true, trigger: 'blur', message: '请输入环境' }],
          namespace: [
            { required: true, trigger: 'blur', message: '请输入服务名称空间' },
          ],
          branch: [{ required: true, trigger: 'blur', message: '请选择分支' }],
        },
        title: '',
        dialogFormVisible: false,
      })

      const showEdit = (row, service) => {
        state.currentService = service
        if (!row.id) {
          state.title = '添加'
        } else {
          state.title = '编辑'
          state.form = JSON.parse(JSON.stringify(row))
        }
        state.dialogFormVisible = true
      }
      const setBranchList = (data) => {
        state.branchList = data
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          name: '',
          namespace: '',
          remark: '',
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            if (state.currentService) {
              state.currentService.configs = [state.form]
            }
            if (state.title === '添加') {
              const { msg } = await doAddConfig({
                ...state.currentService,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            } else {
              const { msg } = await doEditConfig({
                ...state.currentService,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            }
            emit('fetch-data')
            close()
          }
        })
      }
      onMounted(() => {})
      return {
        ...toRefs(state),
        showEdit,
        setBranchList,
        close,
        save,
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
