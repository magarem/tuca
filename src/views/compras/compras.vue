<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ean" placeholder="EAN" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.descricao" placeholder="Descrição" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
      @sort-change="sortChange"
       >
      <!--el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column-->

      <el-table-column label="N" prop="id" sortable="custom" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Código" prop="compraID" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span><a href='' @click.prevent="getList_compraItens(scope.row.compraID)">{{ scope.row.compraID }}</a></span>
        </template>
      </el-table-column>

      <el-table-column label="Cliente" prop="cliente" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.cliente | capitalize }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Subtotal" prop="subtotal" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.subtotal | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Acrescimo" prop="Acrescimo" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.acrescimo | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Desconto" prop="desconto" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.desconto | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Dinheiro" prop="dinheiro" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.dinheiro | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Débito" prop="debito" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.debito | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Crédito" prop="credito" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.credito | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Pago" prop="totalpago" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.totalpago | money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Troco" prop="troco" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.troco | money }}</span>
        </template>
      </el-table-column>


    </el-table>

    <!--pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="EAN" prop="ean">
          <!-- <el-select v-model="temp.ean" class="filter-item" placeholder="EAN"> -->
          <!--el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" /-->
          <el-input v-model="temp.ean" />
          <!-- </el-select> -->
        </el-form-item>
        <el-form-item label="Descrição" prop="descricao">
          <el-input v-model="temp.descricao" />
          <!--el-date-picker v-model="temp.descricao" type="datetime" placeholder="Please pick a date" /-->
        </el-form-item>
        <el-form-item label="Preço" prop="preco">

          <money v-model="temp.pco_compra" v-bind="money" class="el-input__inner"></money>
        </el-form-item>
        <el-form-item label="Unidade" prop="unidade">
          <el-input v-model="temp.unidade" />
        </el-form-item>
        <el-form-item label="Estoque" prop="estoque">
          <el-input v-model="temp.estoque" />
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

    <el-dialog :visible.sync="dialogPvVisible" title="compra" width="80%" top="5vh" center>
       <el-row :gutter="20">
          <el-col :span="4"><div class="grid-content bg-purple"><b>compra #:</b> {{compraNumero}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"><b>Código:</b> {{compraID}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>Data:</b> {{compraData}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>Valor:</b> {{compraTotal|money}}</div></el-col>
       </el-row>
       <br>
      <el-table
        height="250"
        :key="tableKey"
        v-loading="false"
        :data="list2"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange">
        <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Código" prop="ean" sortable="custom" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ean }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Descricao" prop="descricao" sortable="custom" align="center" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.descricao | capitalize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Unidade" prop="unidade" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.unidade }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Preço" prop="pco_compra" sortable="custom" align="center" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.pco_compra | money }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Qnt" prop="qnt" sortable="custom" align="center" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.qnt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="subtotal" prop="subtotal" sortable="custom" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.subtotal | money }}</span>
          </template>
        </el-table-column>


      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Fechar</el-button>
      </span>
    </el-dialog>




  </div>
</template>

<script>
import { fetchList, fetchList_compraItens } from '@/api/compras'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios';
import {Money} from 'v-money'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})



export default {
  name: 'ComplexTable',
  components: { Pagination, Money },
  directives: { waves},
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
      compraNumero: 0,
      compraTotal: 0,
      compraID: '',
      money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          precision: 2,
          masked: false /* doesn't work with directive */
        },
      compraData: '',
      tableKey: 0,
      list: [],
      list2: [],
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
      calendarTypeOptions,
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
    getList(id) {
      this.listLoading = true
      console.log('id:', id);
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
    getList_compraItens(id) {
      this.listLoading = true
      this.dialogPvVisible=true
      console.log('id:', id);

      // Get compras info
      var item = this.list.find(item => item.compraID === id);
      this.compraNumero = item.id
      this.compraID = id
      this.compraData = new Date(parseFloat(item.created)).toLocaleDateString()
      this.compraTotal = item.subtotal - item.desconto + parseFloat(item.acrescimo)

      fetchList_compraItens({compraID: id}).then(response => {
        console.log('response.data.items:', response.data.items)
        this.list2 = response.data.items
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
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
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
          updateArticle(tempData).then(() => {
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
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
