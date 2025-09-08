export type Panel = {
id: string;
title: string;
content?: React.ReactNode;
contentId: string;
};


export type GroupNode = {
id: string;
type: 'group';
tabs: Panel[];
activeTab?: string;
};


export type SplitNode = {
id: string;
type: 'split';
direction: 'row' | 'column';
sizes?: number[];
children: LayoutNode[];
};


export type FloatingNode = {
id: string;
type: 'floating';
x: number;
y: number;
width: number;
height: number;
panel: Panel;
};


export type LayoutNode = GroupNode | SplitNode | FloatingNode;