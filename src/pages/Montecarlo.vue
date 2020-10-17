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
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated keep-alive>
      <q-tab-panel name="parameters">
        <parameters :parameters="parameters" @submit="save" @reset="reload" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
  } from '@vue/composition-api';

  import _ from 'lodash-es';

  import { knownDistributions } from 'components/ProbabilityDistribution.vue';

  import { required, gte, lte } from 'helpers/validation';
  import { ProbabilityDistribution } from 'models/ProbabilityDistribution';

  import Parameters, { IParameters } from 'components/Parameters.vue';

  const defaultParameters: IParameters = {
    pedidos: {
      demanda: _.set(
        knownDistributions.poisson.clone(),
        'parameters',
        { rate: 5 / 60 },
      ),
      tipo: new ProbabilityDistribution('discrete', {
        sandwiches: 0.2,
        pizzas: 0.4,
        empanadas: 0.3,
        hamburgesas: 0.05,
        lomitos: 0.05,
      }, {
        sandwiches: [required(), gte(0), lte(1)],
        pizzas: [required(), gte(0), lte(1)],
        empanadas: [required(), gte(0), lte(1)],
        hamburgesas: [required(), gte(0), lte(1)],
        lomitos: [required(), gte(0), lte(1)],
      }),
      sandwiches: {
        cantidadPedido: 1,
        precioVenta: 500,
        tiempoPreparacion: _.set(
          knownDistributions.normal.clone(),
          'parameters',
          {
            mean: 10,
            std: 5,
          },
        ),
      },
      pizzas: {
        cantidadPedido: 1,
        precioVenta: 250,
        tiempoPreparacion: _.set(
          knownDistributions.uniform.clone(),
          'parameters',
          {
            a: 15,
            b: 18,
          },
        ),
      },
      empanadas: {
        cantidadPedido: _.set(
          knownDistributions.poisson.clone(),
          'parameters',
          { rate: 3 },
        ),
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
      tiempoEnvio: _.set(
        knownDistributions.exponential.clone(),
        'parameters',
        { rate: 1 / 3 },
      ),
      cantidadMaximaPorEnvio: 3,
    },
    entregas: {
      tiempoLimiteCobro: 25,
      tiempoLimiteEspera: 60,
    },
  };

  function useMontecarlo() {
    const state = reactive({
      activeTab: 'parameters',
      parameters: _.cloneDeep(defaultParameters),

      save: (parameters: IParameters) => {
        state.parameters = _.cloneDeep(parameters);
      },
      reload: () => {
        state.parameters = _.cloneDeep(defaultParameters);
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'Montecarlo',
    components: { Parameters },
    setup() {
      return useMontecarlo();
    },
  });
</script>
