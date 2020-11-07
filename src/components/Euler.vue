<template>
  <q-page padding>
    <q-form
      novalidate
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between">
              <span class="text-uppercase text-caption text-primary">
                Condiciones
              </span>
              <q-icon name="fas fa-ruler" class="text-primary" />
            </q-card-section>

            <q-separator inset />

            <q-card-section class="q-gutter-md">
              <q-input
                v-model.number="condicionesIniciales.E"
                label="Índice de elaboración inicial"
                type="number"
                required
                outlined stack-label
                hide-bottom-space lazy-rules
                :rules="[v.required(), v.gte(0), v.lte(100)]"
              />

              <q-input
                v-model.number="K"
                label="Coeficiente K"
                type="number"
                required
                outlined stack-label
                hide-bottom-space lazy-rules
                :rules="[v.required(), v.gte(0.3), v.lte(0.8)]"
              />

              <q-input
                v-model.number="h"
                label="Tamaño del paso"
                type="number"
                required
                outlined stack-label bottom-slots
                lazy-rules
                :rules="[v.required(), v.gte(0)]"
              >
                <template #hint>
                  <span>{{ h ? `${ h / 0.05 } minutos` : '' }}</span>
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-7 col-lg-8">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between">
              <span class="text-uppercase text-caption text-primary">
                Gráfico
              </span>
              <q-icon name="fas fa-chart-area" class="text-primary" />
            </q-card-section>

            <q-separator inset />

            <q-card-section class="q-gutter-md">
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 row justify-end">
          <q-btn label="Guardar" type="submit" color="primary" />
          <q-btn label="Restablecer" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<style lang="scss" scoped>
  .q-card .q-card__section .q-icon {
    font-size: 1.25rem;
  }
</style>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    watch,
    toRefs,
    PropType,
  } from '@vue/composition-api';

  import _ from 'lodash';

  import * as v from 'helpers/validation';

  export interface IEuler {
    condicionesIniciales: {
      E: number
      t: number
    }
    K: number
    h: number
  }

  export default defineComponent({
    name: 'Parameters',
    components: {},
    props: {
      euler: {
        required: true,
        type: Object as PropType<IEuler>,
      },
    },

    setup(props, { emit }) {
      const state = reactive(
        _.cloneDeep(props.euler),
      );

      const onSubmit = () => {
        // eslint-disable-next-line vue/require-explicit-emits
        emit('submit', state);
      };

      const onReset = () => {
        // eslint-disable-next-line vue/require-explicit-emits
        emit('reset');
      };

      watch(
        () => props.euler,
        () => {
          const { condicionesIniciales, K, h } = _.cloneDeep(props.euler);

          state.condicionesIniciales = condicionesIniciales;
          state.K = K;
          state.h = h;
        },
      );

      return {
        v,
        ...toRefs(state),
        onSubmit,
        onReset,
      };
    },
  });
</script>
