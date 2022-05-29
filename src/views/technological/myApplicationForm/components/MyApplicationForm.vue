<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="申请单名称" prop="applyTitle">
        <el-input v-model="form.applyTitle" />
      </el-form-item>
      <el-form-item label="申请单类型" prop="applyType">
        <el-select
          v-model="form.applyType"
          placeholder="请选择申请单类型"
          style="width: 100%"
        >
          <el-option
            v-for="item in applyTypeList"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发版环境" prop="env">
        <el-select
          v-model="form.env"
          filterable
          placeholder="请选择发版环境"
          style="width: 100%"
        >
          <el-option
            v-for="item in publishEnvs"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划发版时间" prop="planPublishTime">
        <el-date-picker
          v-model="form.planPublishTime"
          placeholder="请选择发版时间"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="发版服务" prop="applications">
        <el-select
          v-model="form.applications"
          filterable
          multiple
          placeholder="请选择发版的服务"
          style="width: 100%"
        >
          <el-option
            v-for="item in serviceList"
            :key="item.name"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getList } from '@/api/application'
  import { doEdit, doSave } from '@/api/apply'

  export default defineComponent({
    name: 'MyApplicationForm',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeRef: null,
        form: {
          name: '',
          remark: '',
          parentId: '0',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入角色名称' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        serviceList: [],
        publishEnvs: ['uat', 'pre', 'pro'],
        applyTypeList: [{ name: '正常发版', id: '1' }],
      })

      const showEdit = async (row) => {
        if (!row) {
          state.title = '添加'
        } else {
          state.title = '编辑'
          state.form = JSON.parse(JSON.stringify(row))
        }
        state.dialogFormVisible = true
        const {
          data: { list },
        } = await getList({})
        state.serviceList = list
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          btnRolesCheckedList: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            if (state.title === '添加') {
              const { msg } = await doSave({
                ...state.form,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            } else {
              const { msg } = await doEdit({
                ...state.form,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            }
            emit('fetch-data')
            close()
          }
        })
      }
      onMounted(async () => {})
      return {
        ...toRefs(state),
        showEdit,
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
