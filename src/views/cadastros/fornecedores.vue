<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nome" placeholder="Razão social /  Nome fantasia" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Procurar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Incluir
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Exportar
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!--el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column-->

      <el-table-column label="Razão social" prop="razao_social" sortable="custom" align="center" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.razao_social  | capitalize }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Nome fantasia" prop="nome_fantasia" sortable="custom" align="center" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.nome_fantasia  | capitalize }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Tipo" prop="tipo" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.tipo | capitalize }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Doc" prop="doc" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.doc | capitalize }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Contato" prop="contato" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.contato }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Fone" prop="fone" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.fone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Fone2" prop="fone2" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.fone2 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Email" prop="email" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Endereço" prop="endereco" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.endereco }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CEP" prop="cep" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.cep }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Obs" prop="obs" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.obs }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">

        <el-form-item label="Razão social" prop="razao_social">
          <el-input v-model="temp.razao_social" />
        </el-form-item>

        <el-form-item label="Nome fantasia" prop="nome_fantasia">
          <el-input v-model="temp.nome_fantasia" />
        </el-form-item>

        <el-form-item label="Tipo" prop="tipo">
          <el-input v-model="temp.tipo" />
        </el-form-item>

        <el-form-item label="Doc" prop="doc">
          <el-input v-model="temp.doc" />
        </el-form-item>

        <el-form-item label="Contato" prop="contato">
          <el-input v-model="temp.contato" />
        </el-form-item>

        <el-form-item label="Fone" prop="fone">
          <el-input v-model="temp.fone" />
        </el-form-item>

        <el-form-item label="Fone2" prop="fone2">
          <el-input v-model="temp.fone2" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item label="Endereço" prop="endereco">
          <el-input v-model="temp.endereco" />
        </el-form-item>

        <el-form-item label="CEP" prop="cep">
          <el-input v-model="temp.cep" />
        </el-form-item>

        <el-form-item label="Obs" prop="obs">
          <el-input v-model="temp.obs" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancela
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirma
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, deleteItem } from '@/api/fornecedores'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {Money} from 'v-money'

export default {
  name: 'Fornecedores',
  components: { Pagination, Money },
  directives: { waves },
  filters: {
    money(value) {
      if (!value) return ''
      value = value.toString()
      if (value.indexOf('.')==-1){
        value += ",00"
      }
      return 'R$ ' + value.replace(".",",")
    },
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          precision: 2,
          masked: false /* doesn't work with directive */
        },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log('response.data.items:', response.data.items)
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          create(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Sucesso',
              message: 'Criado com sucesso',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData() {
      delete(this.temp).then(() => {
        this.list.unshift(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Sucesso',
          message: 'Criado com sucesso',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Sucesso',
              message: 'Registro alterado',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Sucesso',
        message: 'Exclusão de registro',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)

      // Server order
      deleteItem(row).then(() => {
        console.log('--->', row.id);
      })

    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
