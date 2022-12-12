import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ZKBadgeboundERC721, ZKBadgeboundERC721__factory } from '../../../types';
import {
  afterDeployment,
  beforeDeployment,
  buildDeploymentName,
  customDeployContract,
  DeployOptions,
  getDeployer,
  wrapCommonDeployOptions,
} from '../utils';

export interface DeployZKBadgeboundERC721Args {
  options?: DeployOptions;
}

export interface DeployedZkBadgeboundERC721 {
  zkBadgeboundERC721: ZKBadgeboundERC721;
}

const CONTRACT_NAME = 'ZKBadgeboundERC721';

async function deploymentAction(
  { options }: DeployZKBadgeboundERC721Args,
  hre: HardhatRuntimeEnvironment
) {
  const deployer = await getDeployer(hre);
  const deploymentName = buildDeploymentName(CONTRACT_NAME, options?.deploymentNamePrefix);
  const deploymentArgs = [];

  await beforeDeployment(hre, deployer, CONTRACT_NAME, deploymentArgs, options);

  const deployed = await customDeployContract(
    hre,
    deployer,
    deploymentName,
    CONTRACT_NAME,
    deploymentArgs,
    (options = {
      behindProxy: false,
    })
  );

  await afterDeployment(hre, deployer, CONTRACT_NAME, deploymentArgs, deployed, options);
  const zkBadgeboundERC721 = ZKBadgeboundERC721__factory.connect(deployed.address, deployer);
  return { zkBadgeboundERC721 };
}

task('deploy-zk-badgebound-erc721').setAction(wrapCommonDeployOptions(deploymentAction));
