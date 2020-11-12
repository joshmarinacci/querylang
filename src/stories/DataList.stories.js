import React from 'react';

import {Grid3Layout} from '../ui/grid3layout.js'

export default {
    title: 'QueryOS/Grid3Layout',
    component: Grid3Layout,
    argTypes: {
    },
};

const Template = (args) => <Grid3Layout {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    primary: true,
    label: 'Button',
};
