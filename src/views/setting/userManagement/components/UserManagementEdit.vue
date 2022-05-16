<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select
          v-model="form.roleIds"
          collapse-tags
          collapse-tags-tooltip
          filterable
          multiple
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
  import { doEdit, doSave } from '@/api/userManagement'
  import { getTree } from '@/api/roleManagement'

  export default defineComponent({
    name: 'UserManagementEdit',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        form: {
          roleIds: [],
        },
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
          roleIds: [{ required: true, trigger: 'blur', message: '请选择角色' }],
        },
        title: '',
        dialogFormVisible: false,
        roleData: [],
      })

      const fetchData = async () => {
        const {
          data: { list },
        } = await getTree()
        state.roleData = list
      }

      const showEdit = (row) => {
        if (!row) {
          state.title = '添加'
          state.rules.password[0].required = true
        } else {
          state.title = '编辑'
          state.rules.password[0].required = false
          state.form = JSON.parse(JSON.stringify(row))
          state.form.roleIds.forEach((item, i) => {
            state.form.roleIds[i] = item - 0
          })
        }
        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          roles: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            state.form.roleIds.forEach((item, i) => {
              state.form.roleIds[i] = item.toString()
            })
            if (state.title === '添加') {
              const { msg } = await doSave(state.form)
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              emit('fetch-data')
            } else {
              const { msg } = await doEdit(state.form)
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              emit('fetch-data')
            }
            close()
          }
        })
      }

      fetchData()
      return {
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>
