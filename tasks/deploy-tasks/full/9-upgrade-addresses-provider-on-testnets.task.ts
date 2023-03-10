import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  afterDeployment,
  beforeDeployment,
  buildDeploymentName,
  customDeployContract,
  DeployOptions,
  getDeployer,
} from '../utils';
import { deploymentsConfig } from '../deployments-config';
import {
  AddressesProvider,
  AddressesProvider__factory,
  TransparentUpgradeableProxy__factory,
} from '../../../types';
import { confirm } from '../../../tasks/utils';

export interface Deployed9 {
  sismoAddressesProvider: AddressesProvider;
}

async function deploymentAction(
  { options }: { options: DeployOptions },
  hre: HardhatRuntimeEnvironment
): Promise<Deployed9> {
  const config = deploymentsConfig[process.env.FORK_NETWORK ?? hre.network.name];

  // we need to use the proxyAdmins of staging since we deployed addressesProvider create2 on staging
  let badNetwork: string;
  let deploymentNetwork = process.env.FORK_NETWORK ?? hre.network.name;
  if (deploymentNetwork === 'goerliTestnet') {
    badNetwork = 'goerliStaging';
  } else if (deploymentNetwork === 'mumbaiTestnet') {
    badNetwork = 'mumbaiStaging';
  } else {
    throw new Error('Invalid network');
  }

  options = {
    isImplementationUpgrade: true,
    proxyAddress: config.sismoAddressesProvider.address,
    ...config.deployOptions,
    ...options,
  };

  if (options.manualConfirm || options.log) {
    console.log('9-upgrade-addresses-provider-on-testnets: ', hre.network.name);
  }
  const CONTRACT_NAME = 'AddressesProvider';

  // Deploy SismoAddressesProvider
  const deployer = await getDeployer(hre);
  const deploymentName = buildDeploymentName(CONTRACT_NAME, options?.deploymentNamePrefix);

  const proxyAdmin = deploymentsConfig[badNetwork].deployOptions.proxyAdmin; // we need to use the proxyAdmins of staging since we deployed addressesProvider create2 on staging

  const deploymentArgs = [
    config.badges.address,
    config.attestationsRegistry.address,
    config.front.address,
    config.hydraS1AccountboundAttester.address,
    config.availableRootsRegistry.address,
    config.commitmentMapper.address,
    config.hydraS1Verifier.address,
    config.sismoAddressesProvider.owner,
  ];

  const initData = new AddressesProvider__factory().interface.encodeFunctionData('initialize', [
    config.sismoAddressesProvider.owner,
  ]);

  await beforeDeployment(hre, deployer, CONTRACT_NAME, deploymentArgs, options);
  const deployed = await customDeployContract(
    hre,
    deployer,
    deploymentName,
    CONTRACT_NAME,
    deploymentArgs,
    {
      ...options,
      proxyData: initData,
      isImplementationUpgrade: true, // implementation version has been bumped from v1 to v2
      proxyAddress: config.sismoAddressesProvider.address,
      proxyAdmin,
    }
  );
  await afterDeployment(hre, deployer, CONTRACT_NAME, deploymentArgs, deployed, options);

  const sismoAddressesProvider = AddressesProvider__factory.connect(
    deployed.address,
    await hre.ethers.getSigner(deploymentsConfig[badNetwork].sismoAddressesProvider.owner as string)
  );

  return {
    sismoAddressesProvider,
  };
}

task('9-upgrade-addresses-provider-on-testnets').setAction(deploymentAction);
