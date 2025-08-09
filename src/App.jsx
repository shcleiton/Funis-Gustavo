import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3, Calculator, AlertTriangle } from 'lucide-react'
import './App.css'

function App() {
  const [selectedFunnel, setSelectedFunnel] = useState('Lançamento')
  const [kpiData, setKpiData] = useState({
    'Lançamento': {
      investimentoTrafego: 5000,
      leadsGerados: 250,
      clientesGerados: 25,
      receitaBruta: 12500,
      receitaLiquida: 10000,
      custosFixos: 2000,
      custosVariaveis: 1500,
      cliques: 1250,
      impressoes: 25000,
      visitas: 500
    },
    'Sala-Reunião Secreta': {
      investimentoTrafego: 3000,
      leadsGerados: 150,
      clientesGerados: 30,
      receitaBruta: 15000,
      receitaLiquida: 12000,
      custosFixos: 1500,
      custosVariaveis: 1000,
      cliques: 900,
      impressoes: 18000,
      visitas: 300
    },
    'VSL': {
      investimentoTrafego: 4000,
      leadsGerados: 200,
      clientesGerados: 20,
      receitaBruta: 10000,
      receitaLiquida: 8000,
      custosFixos: 1800,
      custosVariaveis: 1200,
      cliques: 1000,
      impressoes: 20000,
      visitas: 400
    },
    'Low Ticket': {
      investimentoTrafego: 2000,
      leadsGerados: 400,
      clientesGerados: 80,
      receitaBruta: 8000,
      receitaLiquida: 6400,
      custosFixos: 1000,
      custosVariaveis: 800,
      cliques: 2000,
      impressoes: 40000,
      visitas: 800
    }
  })

  const calculateKPIs = (data) => {
    const cpl = data.investimentoTrafego / data.leadsGerados
    const cac = (data.investimentoTrafego + data.custosFixos + data.custosVariaveis) / data.clientesGerados
    const ctr = (data.cliques / data.impressoes) * 100
    const taxaConversaoCaptura = (data.leadsGerados / data.visitas) * 100
    const taxaConversaoFinal = (data.clientesGerados / data.leadsGerados) * 100
    const ticketMedio = data.receitaBruta / data.clientesGerados
    const roas = data.receitaBruta / data.investimentoTrafego
    const roi = ((data.receitaLiquida - (data.investimentoTrafego + data.custosFixos + data.custosVariaveis)) / (data.investimentoTrafego + data.custosFixos + data.custosVariaveis)) * 100
    const margemContribuicao = ((data.receitaLiquida - data.custosVariaveis) / data.receitaLiquida) * 100

    return {
      cpl: cpl.toFixed(2),
      cac: cac.toFixed(2),
      ctr: ctr.toFixed(2),
      taxaConversaoCaptura: taxaConversaoCaptura.toFixed(2),
      taxaConversaoFinal: taxaConversaoFinal.toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      roas: roas.toFixed(2),
      roi: roi.toFixed(2),
      margemContribuicao: margemContribuicao.toFixed(2)
    }
  }

  const funnels = ['Lançamento', 'Sala-Reunião Secreta', 'VSL', 'Low Ticket']
  const currentData = kpiData[selectedFunnel]
  const currentKPIs = calculateKPIs(currentData)

  const chartData = funnels.map(funnel => {
    const data = kpiData[funnel]
    const kpis = calculateKPIs(data)
    return {
      name: funnel,
      ROI: parseFloat(kpis.roi),
      ROAS: parseFloat(kpis.roas),
      CPL: parseFloat(kpis.cpl),
      CAC: parseFloat(kpis.cac),
      'Taxa Conversão': parseFloat(kpis.taxaConversaoFinal),
      'Receita': data.receitaLiquida
    }
  })

  const pieData = [
    { name: 'Investimento Tráfego', value: currentData.investimentoTrafego, color: '#8884d8' },
    { name: 'Custos Fixos', value: currentData.custosFixos, color: '#82ca9d' },
    { name: 'Custos Variáveis', value: currentData.custosVariaveis, color: '#ffc658' },
    { name: 'Lucro Líquido', value: currentData.receitaLiquida - currentData.investimentoTrafego - currentData.custosFixos - currentData.custosVariaveis, color: '#ff7300' }
  ]

  const getStatusColor = (value, type) => {
    switch(type) {
      case 'roi':
        return value > 100 ? 'text-green-600' : value > 50 ? 'text-yellow-600' : 'text-red-600'
      case 'roas':
        return value > 3 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600'
      case 'conversao':
        return value > 10 ? 'text-green-600' : value > 5 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (value, type) => {
    let isGood = false
    switch(type) {
      case 'roi':
        isGood = value > 100
        break
      case 'roas':
        isGood = value > 3
        break
      case 'conversao':
        isGood = value > 10
        break
    }
    return isGood ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Financeiro - Funis de Vendas</h1>
          <p className="text-gray-600">Controle total de custos, receitas e métricas estratégicas</p>
        </div>

        <Tabs value={selectedFunnel} onValueChange={setSelectedFunnel} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {funnels.map(funnel => (
              <TabsTrigger key={funnel} value={funnel} className="text-sm">
                {funnel}
              </TabsTrigger>
            ))}
          </TabsList>

          {funnels.map(funnel => (
            <TabsContent key={funnel} value={funnel} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CPL</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {currentKPIs.cpl}</div>
                    <p className="text-xs text-muted-foreground">Custo por Lead</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CAC</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {currentKPIs.cac}</div>
                    <p className="text-xs text-muted-foreground">Custo de Aquisição</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    <div className={getStatusColor(parseFloat(currentKPIs.roi), 'roi')}>
                      {getStatusIcon(parseFloat(currentKPIs.roi), 'roi')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getStatusColor(parseFloat(currentKPIs.roi), 'roi')}`}>
                      {currentKPIs.roi}%
                    </div>
                    <p className="text-xs text-muted-foreground">Retorno sobre Investimento</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROAS</CardTitle>
                    <div className={getStatusColor(parseFloat(currentKPIs.roas), 'roas')}>
                      {getStatusIcon(parseFloat(currentKPIs.roas), 'roas')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getStatusColor(parseFloat(currentKPIs.roas), 'roas')}`}>
                      {currentKPIs.roas}x
                    </div>
                    <p className="text-xs text-muted-foreground">Retorno sobre Anúncios</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>KPIs de Conversão</CardTitle>
                    <CardDescription>Métricas de performance do funil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CTR</span>
                      <Badge variant="outline">{currentKPIs.ctr}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Taxa Conversão Captura</span>
                      <Badge variant="outline">{currentKPIs.taxaConversaoCaptura}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Taxa Conversão Final</span>
                      <Badge variant={parseFloat(currentKPIs.taxaConversaoFinal) > 10 ? "default" : "destructive"}>
                        {currentKPIs.taxaConversaoFinal}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ticket Médio</span>
                      <Badge variant="outline">R$ {currentKPIs.ticketMedio}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Margem Contribuição</span>
                      <Badge variant="outline">{currentKPIs.margemContribuicao}%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Custos</CardTitle>
                    <CardDescription>Análise da estrutura de custos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de ROI por Funil</CardTitle>
              <CardDescription>Performance financeira de todos os funis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ROI" fill="#8884d8" name="ROI (%)" />
                  <Bar dataKey="ROAS" fill="#82ca9d" name="ROAS (x)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita</CardTitle>
              <CardDescription>Receita líquida por funil</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="Receita" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alertas e Recomendações
            </CardTitle>
            <CardDescription>Análise automática baseada nos KPIs atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData.map(funnel => {
                const alerts = []
                if (funnel.ROI < 50) alerts.push(`${funnel.name}: ROI baixo (${funnel.ROI}%) - considere otimizar campanhas`)
                if (funnel.ROAS < 2) alerts.push(`${funnel.name}: ROAS baixo (${funnel.ROAS}x) - revisar criativos`)
                if (funnel['Taxa Conversão'] < 5) alerts.push(`${funnel.name}: Taxa de conversão baixa (${funnel['Taxa Conversão']}%) - otimizar funil`)
                
                return alerts.map((alert, index) => (
                  <div key={`${funnel.name}-${index}`} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-sm text-yellow-800">{alert}</span>
                  </div>
                ))
              })}
              {chartData.filter(f => f.ROI > 100).map(funnel => (
                <div key={`success-${funnel.name}`} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-800">{funnel.name}: Excelente performance! ROI de {funnel.ROI}% - considere escalar investimento</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

