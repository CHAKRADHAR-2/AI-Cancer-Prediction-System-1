
export interface NutritionRecommendation {
  category: string;
  foods: string[];
  benefits: string;
  avoidFoods?: string[];
}

export const nutritionDatabase: Record<string, NutritionRecommendation[]> = {
  'Breast Cancer': [
    {
      category: 'Phytoestrogen-Rich Foods',
      foods: ['Soy products', 'Flaxseeds', 'Sesame seeds', 'Lentils', 'Chickpeas'],
      benefits: 'May help balance hormones and reduce breast cancer recurrence risk'
    },
    {
      category: 'Cruciferous Vegetables',
      foods: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Bok choy'],
      benefits: 'Contain indole-3-carbinol which may help metabolize estrogen safely'
    },
    {
      category: 'Omega-3 Rich Foods',
      foods: ['Wild salmon', 'Sardines', 'Walnuts', 'Chia seeds', 'Hemp seeds'],
      benefits: 'Reduce inflammation and support immune function'
    },
    {
      category: 'Foods to Limit',
      foods: ['Processed meats', 'Excess alcohol', 'High-fat dairy', 'Refined sugars', 'Trans fats'],
      benefits: 'Reduce inflammation and hormone disruption',
      avoidFoods: ['Processed meats', 'Excessive alcohol', 'Trans fats']
    }
  ],
  
  'Lung Cancer': [
    {
      category: 'Beta-Carotene Rich Foods',
      foods: ['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Apricots'],
      benefits: 'Support lung tissue health and provide antioxidant protection'
    },
    {
      category: 'Quercetin-Rich Foods',
      foods: ['Onions', 'Apples', 'Berries', 'Green tea', 'Red grapes'],
      benefits: 'Natural anti-inflammatory compounds that may protect lung tissue'
    },
    {
      category: 'Selenium Sources',
      foods: ['Brazil nuts', 'Tuna', 'Eggs', 'Sunflower seeds', 'Brown rice'],
      benefits: 'Essential mineral for lung antioxidant defense systems'
    },
    {
      category: 'Foods to Avoid',
      foods: ['Processed meats', 'Fried foods', 'Excess salt', 'Alcohol', 'Smoked foods'],
      benefits: 'Prevent further lung irritation and inflammation',
      avoidFoods: ['Processed meats', 'Fried foods', 'Smoked foods']
    }
  ],
  
  'Colon Cancer': [
    {
      category: 'High-Fiber Foods',
      foods: ['Whole grains', 'Beans', 'Lentils', 'Artichokes', 'Pears'],
      benefits: 'Promote healthy gut bacteria and regular bowel movements'
    },
    {
      category: 'Probiotic Foods',
      foods: ['Kefir', 'Kombucha', 'Sauerkraut', 'Kimchi', 'Miso'],
      benefits: 'Support beneficial gut microbiome and digestive health'
    },
    {
      category: 'Folate-Rich Foods',
      foods: ['Dark leafy greens', 'Asparagus', 'Avocado', 'Citrus fruits', 'Fortified cereals'],
      benefits: 'Essential for DNA repair and may reduce colorectal cancer risk'
    },
    {
      category: 'Foods to Limit',
      foods: ['Red meat', 'Processed meats', 'Alcohol', 'Refined grains', 'Sugary foods'],
      benefits: 'Reduce inflammation and support gut health',
      avoidFoods: ['Processed meats', 'Excessive red meat', 'Alcohol']
    }
  ],
  
  'Prostate Cancer': [
    {
      category: 'Lycopene-Rich Foods',
      foods: ['Cooked tomatoes', 'Watermelon', 'Pink grapefruit', 'Guava', 'Papaya'],
      benefits: 'Powerful antioxidant specifically beneficial for prostate health'
    },
    {
      category: 'Zinc-Rich Foods',
      foods: ['Pumpkin seeds', 'Oysters', 'Beef (lean)', 'Cashews', 'Chickpeas'],
      benefits: 'Essential mineral for prostate function and immune support'
    },
    {
      category: 'Green Tea & Polyphenols',
      foods: ['Green tea', 'Pomegranate', 'Grapes', 'Dark berries', 'Dark chocolate'],
      benefits: 'Anti-inflammatory compounds that may slow prostate cancer progression'
    },
    {
      category: 'Foods to Reduce',
      foods: ['High-fat dairy', 'Saturated fats', 'Processed foods', 'Excess calcium supplements'],
      benefits: 'May help reduce prostate cancer progression risk',
      avoidFoods: ['High-fat dairy', 'Excess saturated fats']
    }
  ],
  
  'Liver Cancer': [
    {
      category: 'Liver Detox Foods',
      foods: ['Turmeric', 'Milk thistle tea', 'Dandelion greens', 'Artichokes', 'Beets'],
      benefits: 'Support liver detoxification pathways and hepatic function'
    },
    {
      category: 'Choline-Rich Foods',
      foods: ['Eggs', 'Lean beef', 'Fish', 'Quinoa', 'Broccoli'],
      benefits: 'Essential for fat metabolism and liver cell membrane integrity'
    },
    {
      category: 'Antioxidant Powerhouses',
      foods: ['Green tea', 'Blueberries', 'Cranberries', 'Walnuts', 'Olive oil'],
      benefits: 'Protect liver cells from oxidative stress and inflammation'
    },
    {
      category: 'Strictly Avoid',
      foods: ['Alcohol', 'Aflatoxins (moldy nuts)', 'High sodium foods', 'Processed meats', 'Trans fats'],
      benefits: 'Prevent further liver damage and support healing',
      avoidFoods: ['Alcohol', 'Aflatoxins', 'High sodium foods']
    }
  ],
  
  'Stomach Cancer': [
    {
      category: 'Stomach-Soothing Foods',
      foods: ['Ginger', 'Bananas', 'Rice', 'Toast', 'Bone broth'],
      benefits: 'Gentle on stomach lining and reduce gastric inflammation'
    },
    {
      category: 'Vitamin C Sources',
      foods: ['Bell peppers', 'Strawberries', 'Kiwi', 'Broccoli', 'Citrus fruits'],
      benefits: 'Support stomach lining repair and immune function'
    },
    {
      category: 'Probiotic Support',
      foods: ['Plain yogurt', 'Kefir', 'Fermented vegetables', 'Miso soup', 'Tempeh'],
      benefits: 'Support healthy gut bacteria and reduce H. pylori overgrowth'
    },
    {
      category: 'Foods to Avoid',
      foods: ['Spicy foods', 'Acidic foods', 'Pickled foods', 'Smoked meats', 'Excessive salt'],
      benefits: 'Prevent stomach irritation and reduce cancer risk factors',
      avoidFoods: ['Spicy foods', 'Pickled foods', 'Smoked foods']
    }
  ],
  
  'Pancreatic Cancer': [
    {
      category: 'Easy Digestion Foods',
      foods: ['White rice', 'Bananas', 'Applesauce', 'Lean chicken', 'Sweet potatoes'],
      benefits: 'Reduce pancreatic workload and provide gentle nutrition'
    },
    {
      category: 'Enzyme Support',
      foods: ['Papaya', 'Pineapple', 'Ginger', 'Fennel', 'Digestive teas'],
      benefits: 'Natural digestive enzymes to aid pancreatic function'
    },
    {
      category: 'Anti-inflammatory Foods',
      foods: ['Turmeric', 'Ginger', 'Fatty fish', 'Leafy greens', 'Berries'],
      benefits: 'Reduce pancreatic inflammation and support healing'
    },
    {
      category: 'Strictly Limit',
      foods: ['High-fat foods', 'Fried foods', 'Alcohol', 'Simple sugars', 'Processed foods'],
      benefits: 'Reduce pancreatic stress and prevent digestive complications',
      avoidFoods: ['High-fat foods', 'Alcohol', 'Fried foods']
    }
  ],
  
  'Leukemia': [
    {
      category: 'Iron-Rich Foods',
      foods: ['Lean red meat', 'Spinach', 'Lentils', 'Quinoa', 'Pumpkin seeds'],
      benefits: 'Support red blood cell production and combat anemia'
    },
    {
      category: 'B-Vitamin Sources',
      foods: ['Nutritional yeast', 'Eggs', 'Salmon', 'Avocado', 'Dark leafy greens'],
      benefits: 'Essential for blood cell formation and energy metabolism'
    },
    {
      category: 'Immune Support Foods',
      foods: ['Garlic', 'Mushrooms', 'Citrus fruits', 'Zinc-rich foods', 'Probiotics'],
      benefits: 'Support compromised immune system safely'
    },
    {
      category: 'Safety Precautions',
      foods: ['Thoroughly cooked foods', 'Pasteurized products', 'Washed produce', 'Safe water'],
      benefits: 'Prevent infections in immunocompromised state',
      avoidFoods: ['Raw foods', 'Unpasteurized products', 'Unwashed produce']
    }
  ]
};
