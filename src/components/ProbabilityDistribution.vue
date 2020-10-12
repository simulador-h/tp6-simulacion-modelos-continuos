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
        <span style="white-space: pre-wrap">{{ value.getReadableParameters() }}</span>
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

    <q-dialog
      v-model="showConfig"
      @hide="onCancel"
    >
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
                v-for="(val, key) in configurableDistribution.parameters" :key="key"
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
    SetupContext,
  } from '@vue/composition-api';

  import {
    Fragment,
  } from 'vue-fragment';

  import _ from 'lodash-es';

  import { ProbabilityDistribution } from 'models/ProbabilityDistribution';

  import { es } from 'helpers/locale';
  import { required, gt } from 'helpers/validation';

  // @todo make known distributions configurable
  export const knownDistributions: Record<string, ProbabilityDistribution> = {
    uniform: new ProbabilityDistribution('uniform', {
      a: 0,
      b: 1,
    }, {
      a: [required()],
      b: [required()],
    }),
    normal: new ProbabilityDistribution('normal', {
      mean: 0,
      std: 1,
    }, {
      mean: [required()],
      std: [required(), gt(0)],
    }),
    exponential: new ProbabilityDistribution('exponential', {
      rate: 1,
    }, {
      rate: [required(), gt(0)],
    }),
  };

  function useProbabilityDistribution(
    props: { value: ProbabilityDistribution },
    { emit }: SetupContext,
  ) {
    const state = reactive({
      configurableDistribution: props.value.clone(),

      type: computed({
        get: () => props.value.type,
        set: (type) => {
          const distribution = knownDistributions[type];
          emit('input', distribution.clone());
        },
      }),
      types: _.map(knownDistributions, (
        distribution,
        type,
      ) => ({
        label: _.startCase(es[type]),
        value: type,
      })),

      showConfig: false,

      onConfig: () => {
        state.showConfig = true;
      },
      onSubmit: () => {
        emit('input', state.configurableDistribution);
        state.configurableDistribution = state.configurableDistribution.clone();
        state.showConfig = false;
      },
      onCancel: () => {
        state.configurableDistribution = props.value.clone();
        state.showConfig = false;
      },
    });

    watch(
      () => props.value,
      () => {
        state.configurableDistribution = props.value.clone();
      },
    );

    return toRefs(state);
  }

  export default defineComponent({
    name: 'ProbabilityDistribution',
    components: { Fragment },
    props: {
      value: {
        type: Object as PropType<ProbabilityDistribution>,
        required: true,
      },
    },

    setup(props, ctx) {
      return {
        es,
        ...useProbabilityDistribution(props, ctx),
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
