import React from 'react';
import { IconType } from 'react-icons';
import {
    SiUnity,
    SiUnrealengine,
    SiBlender,
    SiSnapchat,
    SiAutodesk
} from 'react-icons/si';
import {
    FaVrCardboard,
    FaEye,
    FaCode,
    FaMobileAlt,
    FaGlasses,
    FaJs
} from 'react-icons/fa';
import { MdViewInAr } from 'react-icons/md';
import { IconWrapper } from './IconWrapper';

// Map skill names to their corresponding icons
export const getSkillIcon = (skillName: string): React.ReactNode => {
    const iconMap: { [key: string]: IconType } = {
        // Development
        'Unity': SiUnity,
        'Unreal Engine': SiUnrealengine,
        'C#': FaCode,
        'JavaScript': FaJs,
        'Wonderland Engine': FaVrCardboard,

        // AR
        'ARKit': MdViewInAr,
        'ARCore': MdViewInAr,
        'ARFoundation': MdViewInAr,
        'Vuforia': FaEye,
        'Lens Studio': SiSnapchat,
        'Effect House': FaMobileAlt,

        // VR
        'OpenXR': FaGlasses,
        'WebXR': FaVrCardboard,

        // CGI
        'Blender': SiBlender,
        'Maya': SiAutodesk,
    };

    const IconComponent = iconMap[skillName];

    if (IconComponent) {
        return <IconWrapper icon={IconComponent} size={14} />;
    }

    return <IconWrapper icon={FaCode} size={14} />;
};
