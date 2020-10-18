import {
  TDistributionParameters,
  TDistributionValidators,
  ProbabilityDistribution,
} from 'models/ProbabilityDistribution';

import { required, gt, lt } from 'helpers/validation';

export const defaultParameters: TDistributionParameters = {
  ship: 0.5,
  head: 0.5,
};

export const defaultValidators: TDistributionValidators = {
  ship: [required(), gt(0), lt(1)],
  head: [required(), gt(0), lt(1)],
};

export class DiscreteDistribution extends ProbabilityDistribution {
  constructor(
    parameters: TDistributionParameters = defaultParameters,
    validators: TDistributionValidators = defaultValidators,
  ) {
    super('discrete', parameters, validators);
  }
}
