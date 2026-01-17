// JIŽ50 Nutrition Products with Educational Explanations

import type { NutritionProduct } from './types';

export const nutritionProducts: Record<string, NutritionProduct[]> = {
  // PŘED STARTEM (km 0)
  preStart: [
    {
      id: 'pre-sport',
      name: 'ENERVIT PRE SPORT',
      desc: 'Energie před výkonem - sacharidy',
      correct: true,
      boost: 2,
      explanation:
        'Správná volba! PRE SPORT dodá tělu rychle dostupnou energii před závodem díky optimálnímu složení sacharidů.',
      benefit: 'Rychlý nástup energie, připraví svaly na výkon',
    },
    {
      id: 'after-sport-pre',
      name: 'ENERVIT AFTER SPORT',
      desc: 'Regenerace po výkonu',
      correct: false,
      boost: -3,
      explanation:
        'Špatné načasování! AFTER SPORT je určen pro regeneraci PO závodu, ne před ním. Obsahuje složení pro obnovu svalů.',
      benefit: 'Skvělý produkt - ale až po závodě!',
    },
    {
      id: 'protein-bar-pre',
      name: 'ENERVIT PROTEIN BAR',
      desc: 'Proteinová tyčinka - těžké trávení',
      correct: false,
      boost: -1,
      explanation:
        'Proteiny se tráví pomalu a mohou zatížit žaludek před výkonem. Před závodem potřebuješ rychlé sacharidy!',
      benefit: 'Vhodné pro regeneraci, ne pro start závodu',
    },
  ],

  // STATION 1 (km 8) - začátek závodu
  station1: [
    {
      id: 'isotonic-1',
      name: 'ENERVIT ISOTONIC',
      desc: 'Doplnění tekutin a minerálů',
      correct: true,
      boost: 2,
      explanation:
        'Výborně! Izotonický nápoj rychle doplní tekutiny a minerály ztracené pocením. Optimální volba v úvodu závodu.',
      benefit: 'Rychlá hydratace, šetrné k žaludku',
    },
    {
      id: 'gel-1',
      name: 'ENERVIT GEL',
      desc: 'Rychlá energie',
      correct: true,
      boost: 1.5,
      explanation:
        'Dobrá volba! Gel poskytne rychlou dávku energie. V úvodu závodu ale stačí i izotonický nápoj.',
      benefit: '25g sacharidů, rychlé vstřebání',
    },
    {
      id: 'r2-sport-1',
      name: 'ENERVIT R2 SPORT',
      desc: 'Regenerační nápoj - příliš brzy!',
      correct: false,
      boost: -2,
      explanation:
        'R2 SPORT je regenerační nápoj určený pro období PO závodě! Teď potřebuješ energii, ne regeneraci.',
      benefit: 'Perfektní volba - ale až v cíli!',
    },
  ],

  // STATION 2 (km 16)
  station2: [
    {
      id: 'gel-2',
      name: 'ENERVIT GEL',
      desc: 'Rychlá energie 25g sacharidů',
      correct: true,
      boost: 2,
      explanation:
        'Perfektní! Ve třetině závodu je gel ideální pro rychlé doplnění energie. 25g sacharidů okamžitě vstoupí do krve.',
      benefit: 'Rychlá absorpce, praktické balení',
    },
    {
      id: 'carbo-bar',
      name: 'ENERVIT CARBO BAR',
      desc: 'Sacharidová tyčinka',
      correct: true,
      boost: 1.5,
      explanation:
        'Dobrá volba! CARBO BAR dodá sacharidy v pevné formě. Některým závodníkům vyhovuje více než gel.',
      benefit: 'Delší uvolňování energie, pocit sytosti',
    },
    {
      id: 'protein-shake',
      name: 'ENERVIT PROTEIN SHAKE',
      desc: 'Protein - špatné načasování',
      correct: false,
      boost: -2,
      explanation:
        'Protein shake se pomalu vstřebává a zatíží trávení. Během závodu potřebuješ rychlé sacharidy!',
      benefit: 'Výborný po závodě pro regeneraci svalů',
    },
  ],

  // STATION 3 (km 25) - půlka závodu
  station3: [
    {
      id: 'gel-competition',
      name: 'ENERVIT GEL COMPETITION',
      desc: 'Gel s kofeinem - boost!',
      correct: true,
      boost: 3,
      explanation:
        'Skvělá volba! V půlce závodu je kofein ideální pro mentální i fyzický boost. Competition gel má optimální dávku.',
      benefit: 'Kofein + sacharidy = dvojitý efekt',
    },
    {
      id: 'isotonic-2',
      name: 'ENERVIT ISOTONIC',
      desc: 'Doplnění minerálů',
      correct: true,
      boost: 1.5,
      explanation:
        'Dobrá volba! Hydratace je důležitá. Ale v půlce závodu by gel s kofeinem dal větší boost.',
      benefit: 'Spolehlivá hydratace a minerály',
    },
    {
      id: 'after-sport-mid',
      name: 'ENERVIT AFTER SPORT',
      desc: 'Regenerace - ještě ne!',
      correct: false,
      boost: -3,
      explanation:
        'AFTER SPORT je PRO PO závodu! V půlce závodu potřebuješ energii, ne regenerační složení.',
      benefit: 'Šetři si ho do cíle!',
    },
  ],

  // STATION 4 (km 33)
  station4: [
    {
      id: 'gel-kofein',
      name: 'ENERVIT GEL + KOFEIN',
      desc: 'Energie + kofein na finiš',
      correct: true,
      boost: 2.5,
      explanation:
        'Výborně! Kofeinový gel v poslední třetině závodu pomůže udržet tempo a koncentraci až do cíle.',
      benefit: 'Dvojitý účinek: energie + mentální ostrost',
    },
    {
      id: 'gel-4',
      name: 'ENERVIT GEL',
      desc: 'Rychlá energie',
      correct: true,
      boost: 2,
      explanation:
        'Dobrá volba! Klasický gel spolehlivě doplní energii. Kofeinová verze by ale dala extra boost.',
      benefit: 'Osvědčená klasika',
    },
    {
      id: 'recovery-drink',
      name: 'ENERVIT RECOVERY DRINK',
      desc: 'Regenerace - příliš brzy',
      correct: false,
      boost: -2,
      explanation:
        'Recovery Drink je pro regeneraci PO závodě! Teď potřebuješ energii na posledních 17 km.',
      benefit: 'Počkej s ním do cíle',
    },
  ],

  // STATION 5 (km 42) - poslední občerstvení
  station5: [
    {
      id: 'gel-competition-final',
      name: 'ENERVIT GEL COMPETITION',
      desc: 'Poslední dávka energie!',
      correct: true,
      boost: 3,
      explanation:
        'Perfektní! Poslední gel s kofeinem ti pomůže zvládnout závěrečných 8 km v plném tempu!',
      benefit: 'Finální boost pro silný finiš',
    },
    {
      id: 'sport-gel',
      name: 'ENERVIT SPORT GEL',
      desc: 'Sportovní gel',
      correct: true,
      boost: 2,
      explanation:
        'Dobrá volba! Sport Gel dodá potřebnou energii. Kofeinová verze by ale byla ještě lepší.',
      benefit: 'Rychlá energie na závěr',
    },
    {
      id: 'protein-bar-final',
      name: 'ENERVIT PROTEIN BAR',
      desc: 'Těžké na žaludek před cílem',
      correct: false,
      boost: -2,
      explanation:
        'Proteinová tyčinka těsně před cílem? To zatíží žaludek a zpomalí tě. Potřebuješ rychlé sacharidy!',
      benefit: 'Skvělé po závodě, ne teď',
    },
  ],

  // PO ZÁVODĚ (km 50) - v cíli
  postRace: [
    {
      id: 'r2-sport-final',
      name: 'ENERVIT R2 SPORT',
      desc: 'Kompletní regenerace - SPRÁVNĚ!',
      correct: true,
      boost: 0,
      explanation:
        'Perfektní volba! R2 SPORT obsahuje vše pro optimální regeneraci: sacharidy, proteiny a minerály.',
      benefit: 'Kompletní regenerace do 30 minut po výkonu',
    },
    {
      id: 'after-sport-final',
      name: 'ENERVIT AFTER SPORT',
      desc: 'Regenerace po výkonu',
      correct: true,
      boost: 0,
      explanation:
        'Výborně! AFTER SPORT pomůže tělu zahájit regeneraci. Doplníš sacharidy i proteiny.',
      benefit: 'Rychlejší zotavení, menší svalová bolest',
    },
    {
      id: 'pre-sport-final',
      name: 'ENERVIT PRE SPORT',
      desc: 'Před výkonem? Už je po!',
      correct: false,
      boost: 0,
      explanation:
        'PRE SPORT je určen PŘED závodem! Teď potřebuješ regenerační produkt s proteiny.',
      benefit: 'Příště ho použij před startem',
    },
  ],
};

// Get shuffled products for a station
export function getShuffledProducts(phase: string): NutritionProduct[] {
  const products = nutritionProducts[phase];
  if (!products) return [];

  return [...products].sort(() => Math.random() - 0.5);
}

// Get performance rating based on correct choices
export function getPerformanceRating(correctChoices: number): {
  title: string;
  message: string;
  color: string;
} {
  if (correctChoices >= 6) {
    return {
      title: 'PROFESIONÁL',
      message:
        'Skvělé! Máš perfektní znalosti výživové strategie pro Jizerskou 50!',
      color: '#ffd700',
    };
  } else if (correctChoices >= 4) {
    return {
      title: 'POKROČILÝ',
      message: 'Velmi dobře! Máš solidní základy sportovní výživy.',
      color: '#c0c0c0',
    };
  } else if (correctChoices >= 2) {
    return {
      title: 'ZAČÁTEČNÍK',
      message: 'Dobrý začátek! Správná výživa ti pomůže k lepšímu času.',
      color: '#cd7f32',
    };
  } else {
    return {
      title: 'NOVÁČEK',
      message:
        'Výživu jsi podcenil! Nauč se správně doplňovat energii během závodu.',
      color: '#ff6666',
    };
  }
}

// Generate nutrition plan based on wrong choices
export function generateNutritionPlan(
  choices: { stationIndex: number; correct: boolean; productName: string }[]
): string[] {
  const tips: string[] = [];

  const wrongChoices = choices.filter((c) => !c.correct);

  if (wrongChoices.length === 0) {
    tips.push('Gratulujeme! Tvá výživová strategie byla bezchybná.');
    tips.push('Stejný plán použij i na skutečný závod Jizerská 50.');
  } else {
    tips.push('Tvůj nutriční plán pro Jizerskou 50:');

    wrongChoices.forEach((choice) => {
      const stationName =
        [
          'Před startem',
          'KM 8',
          'KM 16',
          'KM 25',
          'KM 33',
          'KM 42',
          'V cíli',
        ][choice.stationIndex] || '';

      if (choice.stationIndex === 0) {
        tips.push(`${stationName}: Použij PRE SPORT místo ${choice.productName}`);
      } else if (choice.stationIndex === 6) {
        tips.push(`${stationName}: Zvol R2 SPORT pro regeneraci`);
      } else if (choice.stationIndex === 3 || choice.stationIndex === 5) {
        tips.push(
          `${stationName}: GEL COMPETITION s kofeinem ti dodá extra energii`
        );
      } else {
        tips.push(`${stationName}: Gel nebo izotonický nápoj je lepší volba`);
      }
    });
  }

  tips.push('');
  tips.push('Doporučení: Vyzkoušej produkty na tréninku před závodem!');

  return tips;
}
