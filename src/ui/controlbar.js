import React from "react";
import styled from "styled-components";

import { InfoGroup } from "./controlbar-info";
import { ModelsDropdown, FontsDropdown } from "./controlbar-dropdowns";
import {
  ClearOutputsButton,
  PasteOutputsButton,
  CopyOutputsButton
} from "./controlbar-buttons";
import {
  InferenceToggleButtonGroup
} from "./controlbar-togglebuttons"

export const ControlBarLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  min-height: 60px;

  padding: 10px;
  border-bottom: ${props => (props.isBottom ? "none" : "1px dotted gray")};

  text-align: left;
  background-color: lightgray;
`;

export const ControlBarGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ControlBarSpacer = styled.div`
  padding-right: 10px;
`;

export function PrimaryControlBar(props) {
  return (
    <ControlBarLayout >
      <InfoGroup />
      <ControlBarGroup>
        <ModelsDropdown />
        <ControlBarSpacer />
        <FontsDropdown />
      </ControlBarGroup>
      <ControlBarGroup>
        <ClearOutputsButton />
        <ControlBarSpacer />
        <PasteOutputsButton />
        <ControlBarSpacer />
        <CopyOutputsButton />
      </ControlBarGroup>
    </ControlBarLayout>
  );
}

export function SecondaryControlBar(props) {
  return (
    <ControlBarLayout isBottom>
      <ControlBarGroup>
        <InferenceToggleButtonGroup />
        </ControlBarGroup>
      <ControlBarGroup />
    </ControlBarLayout>
  );
}
