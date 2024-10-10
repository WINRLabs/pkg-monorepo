'use client';

import { TowerTemplate } from '@winrlabs/games';
import React from 'react';

const TowerPage = () => {
  return (
    <div>
      <TowerTemplate
        options={{
          scene: {
            backgroundImage: '/tower/tower-bg.png',
            bombImage: '/tower/bomb.png',
            gemImage: '/tower/fish.png',
            logo: '/tower/logo.png',
          },
        }}
      />
      ;
    </div>
  );
};

export default TowerPage;
