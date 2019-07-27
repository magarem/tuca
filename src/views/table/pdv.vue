<template>
  <div class="app-container">
  <el-input v-model="vendaID" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <div class="filter-container">
      <el-input v-model="listQuery.qnt" placeholder="Qnt" style="width: 50px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ean" placeholder="EAN" style="width: 200px;" class="filter-item" @keyup.enter.native="addList()" />
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="addList()">
        add
      </el-button>
      <el-input v-model="listQuery.descricao" placeholder="Descrição" style="width: 300px;" class="filter-item" @click="produtosListVisible = true"  />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="produtosListVisible = true">
        Procurar
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Incluir
      </el-button>


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
      <el-table-column label="venda" prop="vendaID" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.vendaID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="item" prop="vendaItem" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.vendaItem }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Descricao" prop="descricao" sortable="custom" align="center" width="370">
        <template slot-scope="scope">
          <span>{{ scope.row.descricao }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Unidade" prop="unidade" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.unidade }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Preço" prop="pco_venda" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.pco_venda }}</span>
        </template>
      </el-table-column>


      <el-table-column label="Qnt" prop="qnt" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.qnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="subtotal" prop="subtotal" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.subtotal }}</span>
        </template>
      </el-table-column>



      <el-table-column label="Ações" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            X
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-row :gutter="20">
      <el-col :span="12"><div class="grid-content bg-purple">Total da compra: {{ totalGeral }}</div></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="vendaClose()">
          Pagar
        </el-button>
        </div>
      </el-col>

    </el-row>



    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="EAN" prop="ean">
          <el-input v-model="temp.ean" />
        </el-form-item>
        <el-form-item label="Descrição" prop="descricao">
          <el-input v-model="temp.descricao" />
          <!--el-date-picker v-model="temp.descricao" type="datetime" placeholder="Please pick a date" /-->
        </el-form-item>
        <el-form-item label="Preço" prop="preco">
          <el-input v-model="temp.pco_venda" />
        </el-form-item>
        <el-form-item label="Unidade" prop="unidade">
          <el-input v-model="temp.unidade" />
        </el-form-item>
        <el-form-item label="Estoque" prop="estoque">
          <el-input v-model="temp.estoque" />
        </el-form-item>
        <!--el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item-->
        <!--el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item-->
        <!--el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item-->
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="produtosListVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="EAN" prop="ean">
          <!-- <el-select v-model="temp.ean" class="filter-item" placeholder="EAN"> -->
          <!--el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" /-->
          <el-input v-model="temp.ean" />
          <!-- </el-select> -->
        </el-form-item>
        <el-form-item label="Descrição--" prop="descricao">
          <el-input v-model="temp.descricao" />
          <!--el-date-picker v-model="temp.descricao" type="datetime" placeholder="Please pick a date" /-->
        </el-form-item>
        <el-form-item label="Preço" prop="preco">
          <el-input v-model="temp.pco_venda" />
        </el-form-item>
        <el-form-item label="Unidade" prop="unidade">
          <el-input v-model="temp.unidade" />
        </el-form-item>
        <el-form-item label="Estoque" prop="estoque">
          <el-input v-model="temp.estoque" />
        </el-form-item>
        <!--el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item-->
        <!--el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item-->
        <!--el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item-->
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

    <el-dialog :visible.sync="vendaCloseFlg" title="Reading statistics">
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
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios';

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
  components: { Pagination },
  directives: { waves },
  filters: {
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
      vendaID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      vendaItem: 0,
      vendaCloseFlg: false,
      produtosListVisible:false,
      tableKey: 0,
      list: [],
      total: 0,
      totalGeral: 0,
      listLoading: true,
      listQuery: {
        qnt:1,
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
    vendaClose(){
      let json=JSON.stringify(this.list);
      let post_data={json_data:json}
      axios.post('http://localhost:3000/vendaClose',post_data)
    },
    addList() {

      // this.list = [{descricao: "boneca", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"}]
      this.listLoading = true
      // this.total = 1
      fetchList(this.listQuery).then(response => {
        console.log('response.data.items:', response.data.items)

          this.list.push({vendaID: this.vendaID, vendaItem: this.vendaItem++, descricao: response.data.items[0].descricao, pco_venda: response.data.items[0].pco_venda, unidade: response.data.items[0].unidade, qnt: this.listQuery.qnt, subtotal: (parseInt(this.listQuery.qnt) * parseInt(response.data.items[0].pco_venda))})
        this.total = response.data.total

        this.totalGeral += (parseInt(this.listQuery.qnt) * parseInt(response.data.items[0].pco_venda))
        //this.list.push({descricao: "boneca2", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"})
        //
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      // this.list.push({descricao: "boneca2", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"})
      // console.log(this.list);
    },
    getList() {
      // this.list = [{descricao: "boneca", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"}]
      this.listLoading = true
      this.total = 0
      // fetchList(this.listQuery).then(response => {
      //   console.log('response.data.items:', response.data.items)
      //   this.list = response.data.items
      //   this.total = response.data.total
      //
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      // })
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
