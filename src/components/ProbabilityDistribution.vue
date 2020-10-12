<template>
  <fragment>
    <q-select
      v-model="type" :options="types"
      emit-value map-options
      label="Distribución"
      outlined stack-label bottom-slots
      required
    >
      <template #hint>
        <span style="white-space: pre-wrap">{{ distribution.getReadableParameters() }}</span>
      </template>

      <template #after>
        <q-btn
          class="text-primary"
          icon="fas fa-bars"
          flat round dense
          @click="onConfig"
        />
      </template>
    </q-select>

    <q-dialog v-model="showConfig" @hide="onCancel">
      <q-card class="bg-transparent" style="width: 300px">
        <q-form autofocus novalidate @submit.prevent.stop="onSubmit">
          <q-card-section class="row items-center justify-between bg-primary text-white">
            <span class="text-uppercase text-caption text-weight-medium">
              Parámetros
            </span>
            <q-icon name="fas fa-cogs" />
          </q-card-section>

          <q-card-section class="bg-white q-pb-sm">
            <div class="q-gutter-md">
              <q-input
                v-for="(value, key) in configurableDistribution.parameters" :key="key"
                v-model.number="configurableDistribution.parameters[key]"
                :label="es[key]"
                type="number" required
                outlined stack-label
                bottom-slots hide-bottom-space lazy-rules
                :rules="configurableDistribution.validators[key] || []"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-primary">
            <q-btn label="Guardar" type="submit" flat />
            <q-btn v-close-popup label="Cancelar" class="text-grey" flat />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </fragment>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
    computed,
    watch,
    PropType,
  } from '@vue/composition-api';

  import {
    Fragment,
  } from 'vue-fragment';

  import _ from 'lodash-es';

  const es: Record<string, string> = {
    uniform: 'uniforme',
    normal: 'normal',
    exponential: 'exponencial',

    a: 'α',
    b: 'β',
    mean: 'μ',
    std: 'σ',
    rate: 'λ',
  };

  const hasValue = (v: unknown) => (!_.isNil(v) && v !== '');

  const cv = {
    required: (msg = 'El valor es requerido') => (
      (v: unknown) => hasValue(v) || msg
    ),
    number: (msg = 'El valor debe ser un número') => (
      (v: unknown) => !hasValue(v) || _.isNumber(v) || msg
    ),
    integer: (msg = 'El valor debe ser un número entero') => (
      (v: unknown) => !hasValue(v) || _.isInteger(v) || msg
    ),
    gt: (value: number, msg = 'El valor debe ser mayor a :value') => (
      (v: unknown) => !hasValue(v) || !_.isNumber(v) || v > value || msg.replace(/:value/g, value.toString())
    ),
    gte: (value: number, msg = 'El valor debe ser mayor o igual a :value') => (
      (v: unknown) => !hasValue(v) || !_.isNumber(v) || v >= value || msg.replace(/:value/g, value.toString())
    ),
    lt: (value: number, msg = 'El valor debe ser menor a :value') => (
      (v: unknown) => !hasValue(v) || !_.isNumber(v) || v < value || msg.replace(/:value/g, value.toString())
    ),
    lte: (value: number, msg = 'El valor debe ser menor o igual a :value') => (
      (v: unknown) => !hasValue(v) || !_.isNumber(v) || v <= value || msg.replace(/:value/g, value.toString())
    ),
  };

  // export interface IProbabilityDistribution {
  //   type?: string
  //   parameters: Record<string, number>
  // }

  export class ProbabilityDistribution {
    public readonly type: string;
    public parameters: Record<string, number>;
    public readonly validators: Record<string, Array<(value: number) => true | string>>;

    constructor(
      type: string,
      parameters: Record<string, number> = {},
      validators: Record<string, Array<(value: number) => true | string>> = {},
    ) {
      this.type = type;
      this.parameters = _.cloneDeep(parameters);
      this.validators = validators;
    }

    getReadableParameters(): string {
      const stringParameters = _.map(
        this.parameters,
        (value, parameter) => `${es[parameter]} = ${value}`,
      );

      return stringParameters.join('  ~  ');
    }

    clone() {
      return new ProbabilityDistribution(this.type, this.parameters, this.validators);
    }
  }

  const defaultProbabilityDistributions: ProbabilityDistribution[] = [
    new ProbabilityDistribution('uniform', {
      a: 0,
      b: 1,
    }, {
      a: [cv.required()],
      b: [cv.required()],
    }),
    new ProbabilityDistribution('normal', {
      mean: 0,
      std: 1,
    }, {
      mean: [cv.required()],
      std: [cv.required(), cv.gt(0)],
    }),
    new ProbabilityDistribution('exponential', {
      rate: 1,
    }, {
      rate: [cv.required(), cv.gt(0)],
    }),
  ];

  const types = defaultProbabilityDistributions.map(({
    type,
  }) => ({
    label: _.startCase(es[type]),
    value: type,
  }));

  // [{
  //   label: _.startCase(es.uniform),
  //   value: 'uniform',
  // }, {
  //   label: _.startCase(es.normal),
  //   value: 'normal',
  // }, {
  //   label: _.startCase(es.exponential),
  //   value: 'exponential',
  // }],

  function useProbabilityDistribution() {
    const state = reactive({
      distribution: defaultProbabilityDistributions[0],
      configurableDistribution: defaultProbabilityDistributions[0].clone(), // compute

      type: defaultProbabilityDistributions[0].type,
      types,

      showConfig: false,

      onConfig: () => {
        state.showConfig = true;
      },
      onSubmit: () => {
        state.distribution = state.configurableDistribution;
        state.configurableDistribution = state.distribution.clone(); // compute
        state.showConfig = false;
      },
      onCancel: () => {
        state.configurableDistribution = state.distribution.clone();
        state.showConfig = false;
      },
    });

    watch(
      () => state.type,
      (newType) => {
        const distribution = _.find(
          defaultProbabilityDistributions, ['type', newType],
        ) as ProbabilityDistribution;

        state.distribution = distribution;
        state.configurableDistribution = distribution.clone(); // compute
      },
    );

    return toRefs(state);
  }

  export default defineComponent({
    name: 'ProbabilityDistribution',
    components: { Fragment },
    props: {
      probabilityDistribution: {
        type: Object as PropType<ProbabilityDistribution>,
        default: undefined,
      },
    },
    // eslint-disable-next-line vue/no-setup-props-destructure
    setup({ probabilityDistribution }, { emit }) {
      // const onSubmit = () => {
      //   emit('submit', {
      //     distribution
      //   } as IProbabilityDistribution);
      // };

      // const onReset = () => {
      //   emit('reset', {
      //     distribution
      //   } as IProbabilityDistribution);
      // };

      return {
        es,
        ...useProbabilityDistribution(),
      };
    },
  });

  // var jStat = require("jstat");
  // var _ = require("lodash");

  // const distribution = jStat.exponential(.2);

  // const mean = distribution.mean();
  // const variance = distribution.variance();
  // const std = Math.sqrt(variance);

  // let lx = mean;
  // let rx = mean;
  // let p = distribution.pdf(mean);

  // const probabilities = [{ x: mean, p }];

  // while (p >= 0.001) {
  //   lx -= std / 4;
  //   rx += std / 4;
  //   const lp = distribution.pdf(lx);
  //   const rp = distribution.pdf(rx);

  //   if (lp)
  //     probabilities.push({ x: lx, p: lp });

  //   if (rp)
  //     probabilities.push({ x: rx, p: rp });

  //   p = Math.max(lp, rp);
  // }

  // _.sortBy(probabilities, 'x');
</script>
