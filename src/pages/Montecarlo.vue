<template>
  <q-page>
    <q-tabs
      v-model="activeTab"
      align="justify"
      active-color="primary"
      indicator-color="primary"
      class="text-grey"
    >
      <q-tab name="parameters" label="Parámetros" />
      <q-tab name="simulation" label="Simulación" />
      <q-tab name="results" label="Resultados" :disable="!showResults" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated keep-alive>
      <q-tab-panel name="parameters">
        <parameters :parameters="parameters" @submit="save" @reset="reload" />
      </q-tab-panel>
      <q-tab-panel name="simulation">
        <simulation :parameters="parameters" @finishRun="finishRun" @finish="finish" />
      </q-tab-panel>
      <q-tab-panel name="results">
        <results :run-results="runResults" :results="results" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    computed,
    toRefs,
  } from '@vue/composition-api';

  import _ from 'lodash';

  import { UniformDistribution } from 'models/UniformDistribution';
  import { NormalDistribution } from 'models/NormalDistribution';
  import { ExponentialDistribution } from 'models/ExponentialDistribution';
  import { PoissonDistribution } from 'models/PoissonDistribution';
  import { DiscreteDistribution } from 'models/DiscreteDistribution';

  import Parameters, { IParameters } from 'components/Parameters.vue';
  import Results, { IResults, IRunResults } from 'components/Results.vue';
  import Simulation from 'components/Simulation.vue';

  const defaultParameters: IParameters = {
    pedidos: {
      demanda: new PoissonDistribution({ rate: 12 }),
      tipo: new DiscreteDistribution({
        sandwiches: 0.2,
        pizzas: 0.4,
        empanadas: 0.3,
        hamburgesas: 0.05,
        lomitos: 0.05,
      }),
      sandwiches: {
        cantidadPedido: 1,
        precioVenta: 500,
        tiempoPreparacion: new NormalDistribution({ mean: 10, std: 5 }),
      },
      pizzas: {
        cantidadPedido: 1,
        precioVenta: 250,
        tiempoPreparacion: new UniformDistribution({ a: 15, b: 18 }),
      },
      empanadas: {
        cantidadPedido: new PoissonDistribution({ rate: 3 }),
        precioVenta: 25,
        capacidadMaximaFreidora: 3,
        tiempoPreparacionMedio: 2.5,
        tiempoPreparacionCompleto: 3.5,
      },
      hamburgesas: {
        cantidadPedido: 1,
        precioVenta: 400,
        tiempoPreparacion: 8,
      },
      lomitos: {
        cantidadPedido: 1,
        precioVenta: 450,
        tiempoPreparacion: 8,
      },
    },
    envios: {
      tiempoEnvio: new ExponentialDistribution({ rate: 1 / 3 }),
      cantidadMaximaPorEnvio: 3,
    },
    entregas: {
      tiempoLimiteCobro: 25,
      tiempoLimiteEspera: 60,
    },
    turnos: {
      duracionTurno: 6 * 60,
    },
  };

  function useMontecarlo() {
    const state: any = reactive({
      activeTab: 'parameters',
      parameters: _.cloneDeep(defaultParameters),
      results: {},
      runResults: {},
      showResults: computed(
        () => !_.isEmpty(state.results) && !_.isEmpty(state.runResults),
      ),

      save: (parameters: IParameters) => {
        state.parameters = _.cloneDeep(parameters);
      },
      reload: () => {
        state.parameters = _.cloneDeep(defaultParameters);
      },
      finishRun: (results: IRunResults) => {
        state.runResults = results;
      },
      finish: (results: IResults) => {
        state.results = results;
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'Montecarlo',
    components: { Parameters, Simulation, Results },
    setup() {
      return useMontecarlo();
    },
  });
</script>
