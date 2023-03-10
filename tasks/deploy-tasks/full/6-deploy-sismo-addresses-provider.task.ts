import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployOptions } from '../utils';
import { deploymentsConfig } from '../deployments-config';
import { DeployedSismoAddressesProvider } from 'tasks/deploy-tasks/unit/core/deploy-sismo-addresses-provider.task';
import { AddressesProvider } from 'types';

export interface Deployed6 {
  sismoAddressesProvider: AddressesProvider;
}

async function deploymentAction(
  { options }: { options: DeployOptions },
  hre: HardhatRuntimeEnvironment
): Promise<Deployed6> {
  const config = deploymentsConfig[process.env.FORK_NETWORK ?? hre.network.name];
  options = { ...config.deployOptions, ...options };

  if (options.manualConfirm || options.log) {
    console.log('6-deploy-sismo-addresses-provider: ', hre.network.name);
  }

  // Deploy SismoAddressesProvider
  const { sismoAddressesProvider } = (await hre.run('deploy-sismo-addresses-provider', {
    owner: config.sismoAddressesProvider.owner,
    badges: config.badges.address,
    attestationsRegistry: config.attestationsRegistry.address,
    front: config.front.address,
    hydraS1AccountboundAttester: config.hydraS1AccountboundAttester.address,
    commitmentMapperRegistry: config.commitmentMapper.address,
    availableRootsRegistry: config.availableRootsRegistry.address,
    hydraS1Verifier: config.hydraS1Verifier.address,
    options: { ...options, proxyAdmin: config.deployOptions.proxyAdmin },
  })) as DeployedSismoAddressesProvider;

  return {
    sismoAddressesProvider,
  };
}

task('6-deploy-sismo-addresses-provider').setAction(deploymentAction);
