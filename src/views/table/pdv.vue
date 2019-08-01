<template>
  <div class="app-container">
  <el-input v-model="vendaID" placeholder="ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <div class="filter-container">
      <el-input v-model="qnt" placeholder="Qnt" style="width: 50px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ean" placeholder="EAN" style="width: 200px;" class="filter-item" @keyup.enter.native="addList(listQuery.ean)" />
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="addList(listQuery.ean)">
        add
      </el-button>
      <el-input v-model="listQuery.descricao" placeholder="Descrição" style="width: 300px;" class="filter-item" @keyup.enter.native="getList();" />
      <el-button v-show='listQuery.descricao' v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList(); ">
        Procurar
      </el-button>
      <!--el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate(null)">
        Incluir
      </el-button-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="false"
      :data="list"
      border
      fit
      :summary-method="getSummaries"
      show-summary
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!--el-table-column label="venda" prop="vendaID" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.vendaID }}</span>
        </template>
      </el-table-column-->
      <el-table-column label="item" prop="vendaItem" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.vendaItem }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Descricao" prop="descricao" sortable="custom" align="center" width="370">
        <template slot-scope="scope">
          <span>{{ scope.row.descricao  | capitalize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Unidade" prop="unidade" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.unidade }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Preço" prop="pco_venda" sortable="custom" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.pco_venda | money }}</span>
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

      <el-table-column label="Ações" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            X
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-row :gutter="20">
      <el-col :span="20">
        <div class="grid-content bg-purple">&nbsp;</div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple">
        <el-button v-show="totalGeral>0" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="vendaClose()">
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
          <!--el-input v-model="temp.pco_venda" v-money="money"/-->
          <money v-model="temp.pco_venda" v-bind="money" class="el-input__inner"></money>
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

    <el-dialog :visible.sync="produtosListFlg" title="Busca de produto" width="70%">
      <el-table :data="produtosList" border fit highlight-current-row style="width: 100%">

        <!--el-table-column label="ean" prop="ean" sortable="custom" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ean }}</span>
          </template>
        </el-table-column-->

        <el-table-column label="Descricao" prop="descricao" sortable="custom" align="center" width="350">
          <template slot-scope="scope">
            <span>{{ scope.row.descricao | capitalize}}</span>
          </template>
        </el-table-column>
        <el-table-column label="unidade" prop="unidade" sortable="custom" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.unidade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Preço" prop="pco_venda" sortable="custom" align="center" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.pco_venda | money}}</span>
          </template>
        </el-table-column>

        <el-table-column label="Ações" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="tt(row.ean)">
              Incluir
            </el-button>
          </template>
        </el-table-column>

      </el-table>



      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="produtosListFlg = false">Fechar</el-button>
      </span>
    </el-dialog>





    <el-dialog :visible.sync="vendaCloseFlg" title="Fechamento de venda" width="60%" center top="5vh">
      <el-form ref="form" :model="form" label-width="170px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-row>
              <el-col :span="24"><div class="grid-content bg-purple-dark">Venda</div></el-col>
            </el-row>
            <el-form-item label="Total">
              <!--el-input v-model="totalGeral" v-money="money"></el-input-->
              {{totalGeral|money}}
            </el-form-item>
            <el-form-item label="Desconto">
              <!--el-input v-model="desconto" v-money="money"></el-input-->
              <money v-model="desconto" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
            <el-form-item label="Acréscimo">
              <!--el-input v-model="acrescimo" v-money="money"></el-input-->
              <money v-model="acrescimo" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
            <el-form-item label="Total a pagar">
              {{total_a_pagar | money}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="24"><div class="grid-content bg-purple-dark">Pagamento</div></el-col>
            </el-row>
            <el-form-item label="Dinheiro">
              <!--el-input v-model="pago_dinheiro"></el-input-->
              <money v-model="pago_dinheiro" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
            <el-form-item label="Cartão de débito">
              <!--el-input v-model="pago_debito"></el-input-->
              <money v-model="pago_debito" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
            <el-form-item label="Cartão de crédito">
              <!--el-input v-model="pago_credito"></el-input-->
              <money v-model="pago_credito" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
            <el-form-item label="Valor pago">
              <!--el-input v-model="valor_pago"></el-input-->
              <money v-model="valor_pago" v-bind="money" class="el-input__inner"></money>
            </el-form-item>

            <el-form-item label="Troco">
              <!--el-input v-model="pago_troco"></el-input-->
              <money v-if="pago_troco>0" v-model="pago_troco" v-bind="money" class="el-input__inner"></money>
            </el-form-item>
          </el-col>
         </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="pago_troco>=0" type="primary" @click="vendaCloseOk(); dialogPvVisible = false">Confirma</el-button>
        </span>
    </el-dialog>


    <el-dialog
      title="Venda registrada"
      :visible.sync="vendaCloseOkVisible"
      width="30%"
      >
      <span>Venda registrada com sucesso!</span>
      <span slot="footer" class="dialog-footer">
        <!--el-button @click="dialogVisible = false">Cancel</el-button-->
        <el-button type="primary" @click="vendaCloseOkVisible = false">Ok</el-button>
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
      money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          precision: 2,
          masked: false /* doesn't work with directive */
        },
      form:{},
      valor_pago: 0,
      pago_troco: 0,
      pago_dinheiro: 0,
      pago_debito: 0,
      pago_credito: 0,
      total_a_pagar: 0,
      desconto: 0,
      acrescimo: 0,
      pago_falta: 0,
      vendaID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      vendaItem: 0,
      produtosListFlg: false,
      vendaCloseFlg: false,
      produtosListVisible: false,
      vendaCloseOkVisible: false,
      tableKey: 0,
      list: [],
      produtosList: [],
      total: 0,
      totalGeral: 0,
      listLoading: true,
      qnt:1,
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
        create: 'Incluir novo produto'
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
    // this.getList()

  },
  methods: {
    getSummaries(param) {
       const { columns, data } = param;
       const sums = [];
       columns.forEach((column, index) => {
         if (index === 0) {
           sums[index] = '';
           return;
         }
         if (index === 1) {
           sums[index] = '';
           return;
         }
         if (index === 2) {
           sums[index] = '';
           return;
         }
         if (index === 3) {
           sums[index] = '';
           return;
         }
         if (index === 4) {
           sums[index] = 'Total:';
           return;
         }
         if (index === 6) {
           sums[index] = '';
           return;
         }
         const values = data.map(item => Number(item[column.property]));
         if (!values.every(value => isNaN(value))) {
           sums[index] = 'R$ ' + values.reduce((prev, curr) => {
             const value = Number(curr);
             if (!isNaN(value)) {
               return prev + curr;
             } else {
               return prev;
             }
           }, 0);
         } else {
           sums[index] = 'N/A';
         }
       });

       return sums;
     },
    tt(ean){
      this.listQuery.ean = ean
      this.addList(ean)
    },
    vendaClose(){

      this.total_a_pagar = this.totalGeral

      //clean up form
      this.desconto = 0
      this.acrescimo = 0
      this.pago_dinheiro = 0
      this.pago_credito = 0
      this.totalpago = 0
      this.pago_troco = 0 - this.total_a_pagar
      this.vendaCloseFlg = true
    },
    vendaCloseOk(){
      this.totalpago = this.pago_dinheiro + this.pago_debito + this.pago_credito
      let a = {vendaID: this.vendaID, cliente: 0, subtotal: this.totalGeral, desconto: this.desconto, acrescimo: this.acrescimo, total: this.total, dinheiro: this.pago_dinheiro, debito: this.pago_debito, credito: this.pago_credito, totalpago: this.totalpago, troco: this.pago_troco, itens: this.list}
      let json=JSON.stringify(a);
      console.log(json);
      let post_data={json_data:json}
      axios.post('http://localhost:3000/vendaClose', post_data)

      //Reset venda
      this.vendaID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      this.total_a_pagar = 0
      this.totalGeral = 0

      //clean up form
      this.desconto = 0
      this.acrescimo = 0
      this.pago_dinheiro = 0
      this.pago_credito = 0
      this.pago_troco = 0 - this.total_a_pagar
      this.list = []

      this.listQuery.ean = ""
      this.listQuery.descricao = ""

      this.vendaCloseFlg = false
      this.vendaCloseOkVisible = true
    },
    addList(ean) {
      // this.list = [{descricao: "boneca", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"}]
      this.listLoading = true
      // this.total = 1
      fetchList({ean: this.listQuery.ean}).then(response => {
        console.log('response.data.items.length:', response.data.items.length)
        if (response.data.items.length > 0){

          // Caso encontre o código de barra no banco
          this.list.push({vendaID: this.vendaID, vendaItem: this.vendaItem++, descricao: response.data.items[0].descricao, pco_venda: response.data.items[0].pco_venda, unidade: response.data.items[0].unidade, qnt: this.qnt, subtotal: (parseFloat(this.qnt) * parseFloat(response.data.items[0].pco_venda))})
          this.total = response.data.total

          this.totalGeral += (parseFloat(this.qnt) * parseFloat(response.data.items[0].pco_venda))
          //this.list.push({descricao: "boneca2", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"})
          //
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }else{
          // Caso não encontre o código de barra no banco pula para Incluir
          this.handleCreate(this.listQuery.ean)
        }
      })

      // this.list.push({descricao: "boneca2", ean: "454545", estoque: "100", id: 4257, pco_venda: "232", unidade: "un"})
      // console.log(this.list);
    },
    getList() {
      let descricao = this.listQuery.descricao.trim()
      console.log('|'+descricao+'|');
      if (descricao.length > 3){
        this.produtosListFlg = true
        this.listLoading = true
        fetchList({descricao: descricao}).then(response => {
          console.log('response.data.items:', response.data.items)
          this.produtosList = response.data.items
          this.total2 = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      }else{
        this.$notify({
          title: 'Procurar',
          message: 'Digite mais de 3 dígitos',
          type: 'warning',
          duration: 2000
        })
      }
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
    handleCreate(ean) {
      this.resetTemp()
      //alert(ean)
      if (ean!=null) this.temp.ean = ean
      //this.qnt = 10
      this.temp.qnt = this.qnt
      this.temp.unidade = 'uni'
      this.temp.estoque = 10
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            //this.list.unshift(this.temp)
            // Caso encontre o código de barra no banco
            this.list.push({vendaID: this.vendaID, vendaItem: this.vendaItem++, descricao: this.temp.descricao, pco_venda: this.temp.pco_venda, unidade: this.temp.unidade, qnt: this.qnt, subtotal: (parseFloat(this.qnt) * parseFloat(this.temp.pco_venda))})
            this.total = this.list.length

            this.totalGeral += (parseFloat(this.qnt) * parseFloat(this.temp.pco_venda))

            this.dialogFormVisible = false
            this.$notify({
              title: 'Sucesso',
              message: 'Produto cadastrado com sucesso',
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
        title: 'Sucesso',
        message: 'Registro excluido',
        type: 'success',
        duration: 2000
      })
      console.log(row);
      this.totalGeral -= row.subtotal
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
      // this.vendaItem--
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
  },
  watch: {
    // sempre que a pergunta mudar, essa função será executada
    desconto: function () {
      this.total_a_pagar = this.totalGeral - this.desconto + parseFloat(this.acrescimo)
      this.valor_pago = (parseFloat(this.pago_dinheiro) + parseFloat(this.pago_debito) + parseFloat(this.pago_credito))
      this.pago_troco = this.valor_pago - this.total_a_pagar
      // this.answer = 'Esperando você parar de escrever...'
      // this.debouncedGetAnswer()
    },
    acrescimo: function () {
      this.total_a_pagar = this.totalGeral - this.desconto + parseFloat(this.acrescimo)
      this.valor_pago = (parseFloat(this.pago_dinheiro) + parseFloat(this.pago_debito) + parseFloat(this.pago_credito))
      this.pago_troco = this.valor_pago - this.total_a_pagar
      // this.answer = 'Esperando você parar de escrever...'
      // this.debouncedGetAnswer()
    },
    pago_dinheiro: function () {
      this.total_a_pagar = this.totalGeral - this.desconto + parseFloat(this.acrescimo)
      this.valor_pago = (parseFloat(this.pago_dinheiro) + parseFloat(this.pago_debito) + parseFloat(this.pago_credito))
      this.pago_troco = this.valor_pago - this.total_a_pagar
      this.pago_falta = this.total_a_pagar - this.pago_falta
      // this.answer = 'Esperando você parar de escrever...'
      // this.debouncedGetAnswer()
    },
    pago_debito: function () {
      this.total_a_pagar = this.totalGeral - this.desconto + parseFloat(this.acrescimo)
      this.valor_pago = (parseFloat(this.pago_dinheiro) + parseFloat(this.pago_debito) + parseFloat(this.pago_credito))
      this.pago_troco = this.valor_pago - this.total_a_pagar
      // this.answer = 'Esperando você parar de escrever...'
      // this.debouncedGetAnswer()
    },
    pago_credito: function () {
      this.total_a_pagar = this.totalGeral - this.desconto + parseFloat(this.acrescimo)
      this.valor_pago = (parseFloat(this.pago_dinheiro) + parseFloat(this.pago_debito) + parseFloat(this.pago_credito))
      this.pago_troco = this.valor_pago - this.total_a_pagar
      // this.answer = 'Esperando você parar de escrever...'
      // this.debouncedGetAnswer()
    }

  }
}
</script>
