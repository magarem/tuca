<template>
  <div class="app-container">

    <div class="filter-container">

      <el-form :inline="true"  class="demo-form-inline">
        <span class="grid-content bg-red" justify="center" style="font-family: tahoma; font-size: 30px;" v-bind:style="{color: msgMain.color}">
          {{msgMain.txt}}
        </span>&nbsp;
          <el-form-item label="Código do cliente">
            <input class="el-input__inner" ref="cliente" v-model="cliente" style="width: 150px; height: 33px;"  >
          </el-form-item>
          <el-form-item label="Nome do cliente">
            <input class="el-input__inner" ref="clienteBusca" v-model="clienteBusca" style="width: 250px; height: 33px;" @keyup.enter="getCliente(clienteBusca)" >
          </el-form-item>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="getCliente(cliente)">
            Buscar
          </el-button>
          <br>
          <el-form-item label="Quantidade">
            <el-input-number v-model="qnt"  :min="1" :max="100" style="width: 150px;"></el-input-number>
          </el-form-item>
          <el-form-item label="Código">
            <input class="el-input__inner" ref="ean" v-model="listQuery.ean" style="width: 150px; height: 33px;" @keyup.enter="addList(listQuery.ean)" autofocus>
            </input>
          </el-form-item>
          <el-form-item>
              <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="addList(listQuery.ean)">
                Incluir
              </el-button>
          </el-form-item>
          <el-form-item label="Procurar">
            <input class="el-input__inner" ref="descricao" v-model="listQuery.descricao" style="width: 150px; height: 33px;" @keyup.enter.native="searchProductByDesc(listQuery.descricao);" >
            </input>
          </el-form-item>
          <el-form-item>
              <el-button  v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchProductByDesc(listQuery.descricao)">
                Ok
              </el-button>
          </el-form-item>
      </el-form>
    </div>

    <!-- compra itens table -->
    <el-table
      height="250"
      :key="tableKey"
      v-loading="false"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="Código" prop="ean" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ean }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Descricao" prop="descricao" sortable="custom" align="center" width="455">
        <template slot-scope="scope">
          <span>{{ scope.row.descricao | capitalize }}</span>
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

      <el-table-column label="Ações" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /compra itens table -->
    <br>
    <!-- TOTAL -->
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <div class="grid-content bg-red" justify="center" style="font-family: tahoma; font-size: 30px;">
          [{{this.totalItens}} Iten(s)]  Total: {{this.totalGeral | money}}
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="3">
        <div class="grid-content bg-purple-dark" justify="center" style="font-family: tahoma; font-size: 35px;">
          <el-button type="success" round size=medium v-show="totalGeral>0" v-waves :loading="downloadLoading" class="filter-item"  icon="el-icon-download" @click="vendaClose()">
            Pagar
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- /TOTAL -->

    <!----                                                        ----->
    <!----          Modal aux windows                             ----->
    <!----                                                        ----->

    <!-- New product -->
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item label="Código" prop="ean">
          <el-input v-model="temp.ean" />
        </el-form-item>

        <el-form-item label="Descrição" prop="descricao">
          <el-input v-model="temp.descricao" />
        </el-form-item>

        <el-form-item label="Preço custo" prop="preco_custo">
          <money v-model="temp.pco_custo" v-bind="money" class="el-input__inner"></money>
        </el-form-item>

        <el-form-item label="Preço" prop="preco_venda">
          <money v-model="temp.pco_venda" v-bind="money" class="el-input__inner"></money>
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

    <!-- Change qnt of row -->
    <el-dialog :visible.sync="dialogFormQntVisible" :title="textMap[dialogStatus]" top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="140px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Código" prop="ean">
          {{temp2.ean}}
        </el-form-item>
        <el-form-item label="Descrição" prop="descricao">
          {{temp2.descricao}}
        </el-form-item>
        <el-form-item label="Preço" prop="preco">
          {{temp2.pco_venda | money}}
        </el-form-item>
        <el-form-item label="Unidade" prop="unidade">
          {{temp2.unidade}}
        </el-form-item>
        <el-form-item label="Quantidade" prop="qnt">
          <el-input-number v-model="temp2.qnt" @change="temp2.subtotal = temp2.qnt * temp2.pco_venda" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="subtotal" prop="total">
          {{temp2.subtotal | money}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormQntVisible = false">Cancela</el-button>
        <el-button type="primary" @click="updateData()">Confirma</el-button>
      </div>
    </el-dialog>

    <!-- Venda close -->
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

    <!-- Venda close end -->
    <el-dialog :visible.sync="vendaCloseOkVisible" title="Venda registrada" width="30%" >
      <span>Venda registrada com sucesso!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="vendaCloseOkEnd">Ok</el-button>
      </span>
    </el-dialog>

    <!-- Products list -->
    <el-dialog :visible.sync="produtosListFlg" title="Busca de produto" width="70%">
      <el-table :data="produtosList" border fit highlight-current-row style="width: 100%">
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
            <el-button size="mini" type="success" @click="addList(row.ean)">
              Incluir
            </el-button>
          </template>
        </el-table-column>

      </el-table>



      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="produtosListFlg = false">Fechar</el-button>
      </span>
    </el-dialog>

    <!-- Clientes busca lista -->
    <el-dialog :visible.sync="clientesListFlg" title="Busca cliente" width="70%" align="center">
      <el-table :data="clientesList" border fit highlight-current-row style="width: 100%">
        <el-table-column label="Código" prop="id" sortable="custom" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Nome" prop="nome" sortable="custom" align="center" width="385">
          <template slot-scope="scope">
            <span>{{ scope.row.nome | capitalize}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Documento" prop="doc" sortable="custom" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.doc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ações" align="center" width="170" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="default" type="success" @click="clienteSet(row.id)">
              Selecionar
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="clientesListFlg = false">Fechar</el-button>
      </span>
    </el-dialog>

    <!-- /Modal aux windows -->

  </div>
</template>

<script>
  import { fetchList, create, update } from '@/api/produto'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import axios from 'axios';
  import {Money} from 'v-money'

  export default {
    name: 'Balcão',
    components: { Pagination, Money },
    directives: { waves },
    filters: {
      money(value) {
        value = parseFloat(value).toFixed(2)
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
        msgMain: {txt:'Caixa livre', color: 'green'},
        cliente: '',
        clienteBusca: '',
        clientesList: [],
        list2: [],
        vendaItemId: 0,
        totalItens: 0,
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
        clientesListFlg: false,
        dialogFormQntVisible: false,
        dialogFormVisible: false,
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
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: 0,
          ean: ''
        },
        temp2: {
          id: 0
        },
        dialogStatus: '',
        textMap: {
          update: 'Editar',
          create: 'Incluir'
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
    },
    methods: {
      indexMethod(index) {
         return index * 2;
       },
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
      produtoIncluir(ean){
        this.addList(ean)
        this.produtosListFlg = false
      },
      clienteSet(id){
        //this.listQuery.ean = ean
        console.log('cliente id:', id);
        this.cliente = id
        this.clientesListFlg = false
        this.msgMain = {txt:"Venda em curso", color: '#886A08'}
        this.$refs.ean.focus();
      },
      vendaClose(){
        this.totalGeral = 0
        //Totaliza
        for (const v of this.list) {
          this.totalGeral += v.subtotal
        }

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
        let a = {vendaID: this.vendaID, cliente: this.cliente, subtotal: this.totalGeral, desconto: this.desconto, acrescimo: this.acrescimo, total: this.total, dinheiro: this.pago_dinheiro, debito: this.pago_debito, credito: this.pago_credito, totalpago: this.totalpago, troco: this.pago_troco, itens: this.list}
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
        this.pago_debito = 0
        this.pago_credito = 0
        this.pago_troco = 0 - this.total_a_pagar
        this.list = []

        this.listQuery.ean = ""
        this.listQuery.descricao = ""

        this.vendaCloseFlg = false
        this.vendaCloseOkVisible = true
        this.vendaItem = 0;


      },
      vendaCloseOkEnd(){
        this.totalItens = 0;
        this.msgMain = {txt: "Caixa Livre", color: 'green'}
        this.listQuery.descricao = ""
        this.$refs.ean.focus();
        this.vendaCloseOkVisible = false;

      },
      addList(ean) {

        // Modal close and show loading...
        this.produtosListFlg = false
        this.listLoading = true

        // Search product EAN code in databank
        fetchList({ean: ean}).then(response => {

          // Caso encontre o código de barra no banco executa bloco
          if (response.data.items.length > 0){
            this.vendaItemId++ // add one in venda ID
            let item = response.data.items[0] // Aux var
            let subtotal = (parseFloat(this.qnt) * parseFloat(item.pco_venda)) // Calc row subtotal

            // Add in list array
            this.list.unshift({id: this.vendaItemId, vendaID: this.vendaID, ean: ean, descricao: item.descricao, pco_venda: item.pco_venda, unidade: item.unidade, qnt: this.qnt, subtotal: subtotal})
            this.total = response.data.total // Rows total

            // Itens sum
            this.totalItens = 0
            for (let t=0; t<this.list.length; t++){
              this.totalItens += this.list[t].qnt
            }

            // Total Calc
            this.totalGeral += (parseFloat(this.qnt) * parseFloat(item.pco_venda))

            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)

            // Reset top doc values
            this.listQuery.ean = ""
            this.qnt = 1

            // EAN input focus to get ready to next product EAN enter
            this.$refs.ean.focus();
          }else{
            // Caso não encontre o código de barra no banco pula para Incluir
            this.handleProductCreate(ean)
          }
        })
      },
      searchProductByDesc(desc) {

        // Get out empty spaces id desc
        let descricao = desc.trim()
        console.log('|'+descricao+'|');

        // If search word have more than 2 chars execute block
        if (descricao.length > 2){
          this.produtosListFlg = true // Open products window
          this.listLoading = true // Open listLoading

          // Search desc in databank
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
          // Show warning advise when desc words are less than 3 words
          this.$notify({
            title: 'Procurar',
            message: 'Digite mais de 2 dígitos',
            type: 'warning',
            duration: 2000
          })
        }

        // Reset search input fields
        this.listQuery.ean = ""
        this.listQuery.descricao = ""
      },
      getCliente(clienteBusca) {
        let self = this
        self.clientesList = []
        console.log('|'+this.clienteBusca+'|');
        if (this.clienteBusca.length > 2){
          this.clientesListFlg = true
          this.listLoading = true
          axios.get('http://localhost:3000/dev-api/clientes?nome=' + this.clienteBusca)
            .then(function (response) {
              // handle success
              console.log('response:', response.data.data.items);

              self.clientesList = response.data.data.items
              console.log('clientesList:', self.clientesList);
              this.total2 = response.data.total
              // Just to simulate the time of the request
              setTimeout(() => {
                this.listLoading = false
              }, 1.5 * 1000)
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            });

        }else{
          this.$notify({
            title: 'Procurar',
            message: 'Digite mais de 2 dígitos',
            type: 'warning',
            duration: 2000
          })
        }
        this.listQuery.ean = ""
        this.listQuery.descricao = ""
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
          id: this.temp.id,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleProductCreate(ean) {
        this.resetTemp()
        //alert(ean)
        if (ean!=null) this.temp.ean = ean
        //this.qnt = 10
        this.temp.id++
        console.log('this.temp.id:', this.temp.id);
        console.log('ean:', ean);
        this.temp.ean = ean
        this.temp.qnt = this.qnt
        this.temp.unidade = 'uni'
        this.temp.estoque = 10
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.listQuery.ean = ""
        this.qnt = 1
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            create(this.temp).then(() => {
              //this.list.unshift(this.temp)
              // Caso encontre o código de barra no banco
              this.vendaItemId++
              let aux = {id: this.vendaItemId, ean: this.temp.ean, descricao: this.temp.descricao, pco_venda: this.temp.pco_venda, unidade: this.temp.unidade, qnt: this.qnt, subtotal: (parseFloat(this.qnt) * parseFloat(this.temp.pco_venda))}
              console.log(aux);
              this.list.unshift(aux)
              this.total = this.list.length

              this.totalGeral += (parseFloat(this.qnt) * parseFloat(this.temp.pco_venda))

              //itens sum
              this.totalItens = 0
              for (let t=0; t<this.list.length; t++){
                this.totalItens += this.list[t].qnt
              }

              console.log('this.totalItens:', this.totalItens);

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
        console.log(row);
        this.temp2 = Object.assign({}, row) // copy obj
        this.temp2.timestamp = new Date(this.temp2.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormQntVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp2)
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            // updateArticle(tempData).then(() => {
              for (const v of this.list) {
                console.log('this.temp2.id:', this.temp2.id);
                if (v.id === this.temp2.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp2)
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
              //itens sum
              this.totalItens = 0
              for (let t=0; t<this.list.length; t++){
                this.totalItens += this.list[t].qnt
              }
              //Totaliza
              this.totalGeral = 0
              for (const v of this.list) {
                this.totalGeral += v.subtotal
              }
              this.dialogFormQntVisible = false
            // })
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
        //itens sum
        this.totalItens = 0
        for (let t=0; t<this.list.length; t++){
          this.totalItens += this.list[t].qnt
        }
        // this.vendaItem--
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
