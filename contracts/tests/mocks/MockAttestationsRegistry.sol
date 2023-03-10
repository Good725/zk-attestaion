// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
import {IAttestationsRegistry} from '../../core/interfaces/IAttestationsRegistry.sol';
import {AttestationsRegistryConfigLogic} from '../../core/libs/attestations-registry/AttestationsRegistryConfigLogic.sol';
import {AttestationsRegistryState} from '../../core/libs/attestations-registry/AttestationsRegistryState.sol';
import {IBadges} from '../../core/interfaces/IBadges.sol';
import {Attestation, AttestationData} from '../../core/libs/Structs.sol';

contract MockAttestationsRegistry {
  uint256 immutable ATTESTATION_VALUE;

  event AttestationRecorded(Attestation attestation);

  constructor(uint256 attestationValue) {
    ATTESTATION_VALUE = attestationValue;
  }

  function getAttestationValue(
    uint256 collectionId,
    address owner
  ) external view returns (uint256) {
    return ATTESTATION_VALUE;
  }

  function recordAttestations(Attestation[] calldata attestations) external {
    for (uint256 i = 0; i < attestations.length; i++) {
      emit AttestationRecorded(attestations[i]);
    }
  }
}
