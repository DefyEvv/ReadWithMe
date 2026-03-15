import { BookTheme } from '../types';

export const bookThemes: BookTheme[] = [
  {
    id: 'ocean-adventure',
    title: 'Ocean Adventure',
    description: 'Dive deep with Finn the friendly fish',
    coverPrompt: 'A cheerful cartoon fish swimming in bright blue ocean water with coral reefs, bubbles, and colorful sea plants, warm animated movie style, child-friendly illustration',
    levels: [
      {
        id: 'ocean-1',
        level: 1,
        title: 'Finn Can Swim',
        pages: [
          {
            pageNumber: 1,
            text: 'Finn is a fish.',
            imagePrompt: 'A small orange and white fish with big friendly eyes swimming near colorful coral, warm ocean colors, animated style',
            altText: 'Finn the fish swimming'
          },
          {
            pageNumber: 2,
            text: 'Finn can swim.',
            imagePrompt: 'The small fish swimming happily through blue water with bubbles around, sunlight streaming down from above',
            altText: 'Finn swimming in the ocean'
          },
          {
            pageNumber: 3,
            text: 'Finn can dip.',
            imagePrompt: 'The fish diving downward in the water, playful expression, sea plants below',
            altText: 'Finn diving down'
          },
          {
            pageNumber: 4,
            text: 'Finn can zip.',
            imagePrompt: 'The fish swimming very fast, motion lines behind him, excited happy face',
            altText: 'Finn swimming fast'
          },
          {
            pageNumber: 5,
            text: 'Finn sees a pal.',
            imagePrompt: 'Finn approaching another small friendly fish, both looking happy, coral reef background',
            altText: 'Finn meeting a friend'
          },
          {
            pageNumber: 6,
            text: 'It is Max.',
            imagePrompt: 'A blue and yellow fish with a friendly smile, swimming near Finn, colorful underwater scene',
            altText: 'Max the fish appears'
          },
          {
            pageNumber: 7,
            text: 'Max can swim.',
            imagePrompt: 'Both fish swimming together through the coral reef, happy and playful',
            altText: 'Max and Finn swim together'
          },
          {
            pageNumber: 8,
            text: 'Pals have fun!',
            imagePrompt: 'Both fish playing together among bubbles and sea plants, joyful scene, bright colors',
            altText: 'The fish friends having fun'
          }
        ]
      },
      {
        id: 'ocean-2',
        level: 2,
        title: 'The Lost Shell',
        pages: [
          {
            pageNumber: 1,
            text: 'Finn lost his pink shell.',
            imagePrompt: 'Finn looking sad and worried, searching around coral and rocks, no shell visible',
            altText: 'Finn looking for his shell'
          },
          {
            pageNumber: 2,
            text: 'He looks by the rocks.',
            imagePrompt: 'Finn swimming near large underwater rocks, peering between them, determined expression',
            altText: 'Finn searching near rocks'
          },
          {
            pageNumber: 3,
            text: 'He looks in the sand.',
            imagePrompt: 'Finn looking down at sandy ocean floor, little sand clouds rising',
            altText: 'Finn looking in the sand'
          },
          {
            pageNumber: 4,
            text: 'Max swims over to help.',
            imagePrompt: 'Max swimming toward Finn with a kind, helpful expression',
            altText: 'Max coming to help'
          },
          {
            pageNumber: 5,
            text: 'They look together near the kelp.',
            imagePrompt: 'Both fish swimming through tall green kelp plants, searching carefully',
            altText: 'Friends searching in kelp'
          },
          {
            pageNumber: 6,
            text: 'Max sees something pink and shiny.',
            imagePrompt: 'Max spotting a pink shell half-hidden in sea plants, excited expression',
            altText: 'Max finding the shell'
          },
          {
            pageNumber: 7,
            text: 'It is the shell!',
            imagePrompt: 'Close-up of the beautiful pink shell among green sea grass, sparkling',
            altText: 'The pink shell'
          },
          {
            pageNumber: 8,
            text: 'Finn is so happy to have it back.',
            imagePrompt: 'Finn holding his pink shell happily, Max beside him, both smiling, celebratory bubbles around',
            altText: 'Finn happy with his shell'
          }
        ]
      },
      {
        id: 'ocean-3',
        level: 3,
        title: 'The Deep Sea Cave',
        pages: [
          {
            pageNumber: 1,
            text: 'Finn and Max found a big cave today.',
            imagePrompt: 'Two fish looking at a large, mysterious cave entrance in deep blue water, dark inside',
            altText: 'Fish discovering a cave'
          },
          {
            pageNumber: 2,
            text: 'The cave was dark but they wanted to explore.',
            imagePrompt: 'The fish at the cave entrance, looking curious but a little nervous, cave opening dark',
            altText: 'Looking into the dark cave'
          },
          {
            pageNumber: 3,
            text: 'They swam slowly into the deep water.',
            imagePrompt: 'Both fish swimming carefully into darker blue water, cautious expressions',
            altText: 'Swimming into the cave'
          },
          {
            pageNumber: 4,
            text: 'Suddenly they saw a glowing light ahead.',
            imagePrompt: 'Fish seeing a soft blue-green glow in the distance inside the cave, wonder in their eyes',
            altText: 'Seeing a mysterious glow'
          },
          {
            pageNumber: 5,
            text: 'What could it be in this secret cave?',
            imagePrompt: 'Fish swimming closer to the glowing light, curious and excited',
            altText: 'Approaching the glow'
          },
          {
            pageNumber: 6,
            text: 'It was a family of jellyfish dancing together!',
            imagePrompt: 'Beautiful glowing jellyfish floating and swirling in the cave, magical bioluminescent light',
            altText: 'Glowing jellyfish family'
          },
          {
            pageNumber: 7,
            text: 'The jellyfish welcomed them and lit up the cave.',
            imagePrompt: 'Jellyfish glowing brighter, illuminating beautiful cave walls, fish friends amazed and happy',
            altText: 'Jellyfish lighting the cave'
          },
          {
            pageNumber: 8,
            text: 'Finn and Max made new friends in a magical place.',
            imagePrompt: 'All the sea creatures together in the glowing cave, happy and friendly scene, warm colors',
            altText: 'New friends together'
          }
        ]
      }
    ]
  },
  {
    id: 'animal-city',
    title: 'Animal City',
    description: 'Join Bea the bunny in a busy town',
    coverPrompt: 'A cheerful cartoon bunny in a colorful city street with shops and buildings, other friendly animals walking by, bright sunny day, animated movie style',
    levels: [
      {
        id: 'city-1',
        level: 1,
        title: 'Bea Goes Out',
        pages: [
          {
            pageNumber: 1,
            text: 'Bea is a bunny.',
            imagePrompt: 'A cute white bunny with pink ears standing in front of a cozy house, big friendly eyes',
            altText: 'Bea the bunny'
          },
          {
            pageNumber: 2,
            text: 'Bea can hop.',
            imagePrompt: 'Bea hopping happily down a sidewalk, ears bouncing, cheerful expression',
            altText: 'Bea hopping'
          },
          {
            pageNumber: 3,
            text: 'She hops to the shop.',
            imagePrompt: 'Bea hopping toward a small colorful shop with a striped awning and window display',
            altText: 'Hopping to the shop'
          },
          {
            pageNumber: 4,
            text: 'The shop has hats.',
            imagePrompt: 'Inside the shop, many colorful hats on display, Bea looking at them',
            altText: 'Shop with hats'
          },
          {
            pageNumber: 5,
            text: 'Bea sees a red hat.',
            imagePrompt: 'Bea looking at a bright red hat on a shelf, excited expression',
            altText: 'Bea seeing red hat'
          },
          {
            pageNumber: 6,
            text: 'She gets the hat.',
            imagePrompt: 'Bea reaching for the red hat, shopkeeper (a kind fox) smiling nearby',
            altText: 'Getting the hat'
          },
          {
            pageNumber: 7,
            text: 'Bea has a red hat.',
            imagePrompt: 'Bea wearing the red hat proudly, looking very happy',
            altText: 'Bea wearing her hat'
          },
          {
            pageNumber: 8,
            text: 'She hops back home.',
            imagePrompt: 'Bea hopping home wearing her new red hat, sunny street scene, happy ending',
            altText: 'Hopping home'
          }
        ]
      },
      {
        id: 'city-2',
        level: 2,
        title: 'The Bus Ride',
        pages: [
          {
            pageNumber: 1,
            text: 'Bea waits for the big yellow bus.',
            imagePrompt: 'Bea standing at a bus stop, looking down the street, wearing her red hat',
            altText: 'Bea at bus stop'
          },
          {
            pageNumber: 2,
            text: 'The bus stops right in front of her.',
            imagePrompt: 'Large friendly yellow bus pulling up, doors opening, kind bear driver visible',
            altText: 'Bus arriving'
          },
          {
            pageNumber: 3,
            text: 'She hops up the steps and sits down.',
            imagePrompt: 'Bea climbing bus steps, other animal passengers visible in seats',
            altText: 'Getting on the bus'
          },
          {
            pageNumber: 4,
            text: 'A squirrel sits next to her with nuts.',
            imagePrompt: 'Friendly squirrel sitting beside Bea, holding acorns, both smiling',
            altText: 'Meeting a squirrel'
          },
          {
            pageNumber: 5,
            text: 'The bus drives past shops and trees.',
            imagePrompt: 'View from bus window showing city shops and green trees passing by',
            altText: 'Riding through the city'
          },
          {
            pageNumber: 6,
            text: 'Bea sees her friend Cam the cat.',
            imagePrompt: 'Bea spotting a orange cat through the window, waving',
            altText: 'Seeing friend Cam'
          },
          {
            pageNumber: 7,
            text: 'The bus stops at the park.',
            imagePrompt: 'Bus stopped at a beautiful green park with playground and flowers',
            altText: 'Arriving at the park'
          },
          {
            pageNumber: 8,
            text: 'Bea and the squirrel hop off together.',
            imagePrompt: 'Bea and squirrel exiting bus at park, ready to play, sunny happy scene',
            altText: 'Getting off at the park'
          }
        ]
      },
      {
        id: 'city-3',
        level: 3,
        title: 'The Market Day Mix-Up',
        pages: [
          {
            pageNumber: 1,
            text: 'Today is market day and the city is very busy.',
            imagePrompt: 'Bustling market street with colorful stalls, many animal characters shopping, bright and cheerful',
            altText: 'Busy market day'
          },
          {
            pageNumber: 2,
            text: 'Bea has a list from her mom to buy apples.',
            imagePrompt: 'Bea holding a small paper list, determined expression, market stalls in background',
            altText: 'Bea with shopping list'
          },
          {
            pageNumber: 3,
            text: 'She looks at the fruit stand for red apples.',
            imagePrompt: 'Bea at a fruit stand with many colorful fruits displayed, searching',
            altText: 'Looking for apples'
          },
          {
            pageNumber: 4,
            text: 'But she accidentally picks up red tomatoes instead!',
            imagePrompt: 'Bea holding round red tomatoes, not realizing her mistake yet, cheerful',
            altText: 'Picking tomatoes by mistake'
          },
          {
            pageNumber: 5,
            text: 'Her friend Cam sees her and starts laughing.',
            imagePrompt: 'Cam the cat pointing and laughing kindly, Bea looking confused',
            altText: 'Cam laughing at the mix-up'
          },
          {
            pageNumber: 6,
            text: 'Cam shows her the apples on the next table.',
            imagePrompt: 'Cam pointing to real apples on another stand, both friends smiling',
            altText: 'Finding the real apples'
          },
          {
            pageNumber: 7,
            text: 'Bea laughs too and trades the tomatoes for apples.',
            imagePrompt: 'Bea exchanging tomatoes for apples at the stand, vendor (a friendly pig) helping',
            altText: 'Trading for apples'
          },
          {
            pageNumber: 8,
            text: 'She thanks Cam and they both share an apple snack.',
            imagePrompt: 'Bea and Cam sitting together eating apple slices, happy friendship moment, market behind them',
            altText: 'Sharing apples together'
          }
        ]
      }
    ]
  },
  {
    id: 'ice-kingdom',
    title: 'Ice Kingdom',
    description: 'Explore snowy lands with Pip the penguin',
    coverPrompt: 'An adorable cartoon penguin on sparkling ice and snow, ice castle in background, northern lights in sky, magical winter wonderland, animated style',
    levels: [
      {
        id: 'ice-1',
        level: 1,
        title: 'Pip on Ice',
        pages: [
          {
            pageNumber: 1,
            text: 'Pip is a penguin.',
            imagePrompt: 'A small cute penguin with big eyes standing on white snow and blue ice',
            altText: 'Pip the penguin'
          },
          {
            pageNumber: 2,
            text: 'Pip can slide.',
            imagePrompt: 'Pip sliding on his belly across shiny ice, happy and playful',
            altText: 'Pip sliding on ice'
          },
          {
            pageNumber: 3,
            text: 'The ice is fun.',
            imagePrompt: 'Pip playing on smooth ice surface, sparkles around, joyful',
            altText: 'Fun on ice'
          },
          {
            pageNumber: 4,
            text: 'Pip sees a hill.',
            imagePrompt: 'Pip looking up at a snowy hill, excited expression',
            altText: 'Seeing a hill'
          },
          {
            pageNumber: 5,
            text: 'He can go up.',
            imagePrompt: 'Pip climbing up the snowy hill, determined little penguin',
            altText: 'Climbing the hill'
          },
          {
            pageNumber: 6,
            text: 'Pip is at the top.',
            imagePrompt: 'Pip standing proudly at the top of the hill, beautiful snowy landscape visible',
            altText: 'At the top'
          },
          {
            pageNumber: 7,
            text: 'Now he can slide down.',
            imagePrompt: 'Pip sliding down the hill very fast, wind in his face, exhilarated',
            altText: 'Sliding down'
          },
          {
            pageNumber: 8,
            text: 'Pip had fun!',
            imagePrompt: 'Pip at the bottom looking very happy and proud, snowy background',
            altText: 'Happy Pip'
          }
        ]
      },
      {
        id: 'ice-2',
        level: 2,
        title: 'The Frozen Fish',
        pages: [
          {
            pageNumber: 1,
            text: 'Pip is hungry for his lunch.',
            imagePrompt: 'Pip looking hungry, standing near an ice fishing hole',
            altText: 'Hungry Pip'
          },
          {
            pageNumber: 2,
            text: 'He looks in the water for fish.',
            imagePrompt: 'Pip peering into a hole in the ice, looking down at dark water',
            altText: 'Looking for fish'
          },
          {
            pageNumber: 3,
            text: 'The water is very cold and deep.',
            imagePrompt: 'View into the icy water showing blue depths below the ice',
            altText: 'Cold deep water'
          },
          {
            pageNumber: 4,
            text: 'Pip sees a silver fish swimming below.',
            imagePrompt: 'A shiny silver fish visible in the water under the ice',
            altText: 'Spotting a fish'
          },
          {
            pageNumber: 5,
            text: 'He dives in with a big splash!',
            imagePrompt: 'Pip diving into the water, splash and bubbles all around',
            altText: 'Diving in'
          },
          {
            pageNumber: 6,
            text: 'Pip swims fast and catches the fish.',
            imagePrompt: 'Pip underwater catching the fish in his beak, successful',
            altText: 'Catching the fish'
          },
          {
            pageNumber: 7,
            text: 'He pops back up through the ice.',
            imagePrompt: 'Pip emerging from the water with fish in beak, water drops flying',
            altText: 'Coming back up'
          },
          {
            pageNumber: 8,
            text: 'Now Pip has a yummy lunch to eat!',
            imagePrompt: 'Pip on the ice happily eating his fish, content and satisfied',
            altText: 'Eating lunch'
          }
        ]
      },
      {
        id: 'ice-3',
        level: 3,
        title: 'The Aurora Mystery',
        pages: [
          {
            pageNumber: 1,
            text: 'One night Pip saw beautiful lights in the sky.',
            imagePrompt: 'Pip looking up at colorful aurora borealis dancing across the dark sky, amazed',
            altText: 'Seeing the aurora'
          },
          {
            pageNumber: 2,
            text: 'The lights were green and purple and danced around.',
            imagePrompt: 'Magnificent aurora with green and purple waves flowing across the starry sky',
            altText: 'Colorful dancing lights'
          },
          {
            pageNumber: 3,
            text: 'Pip wanted to know what made them so bright.',
            imagePrompt: 'Pip thinking and wondering, looking curious at the lights',
            altText: 'Pip wondering'
          },
          {
            pageNumber: 4,
            text: 'He asked his wise old friend Nora the seal.',
            imagePrompt: 'Pip talking to a kind older seal on the ice, aurora above them',
            altText: 'Asking Nora'
          },
          {
            pageNumber: 5,
            text: 'Nora said the lights come from the sun far away.',
            imagePrompt: 'Nora explaining while gesturing to the sky, Pip listening carefully',
            altText: 'Nora explaining'
          },
          {
            pageNumber: 6,
            text: 'The sun sends special sparkles to make them glow.',
            imagePrompt: 'Imaginary sparkles traveling from distant sun toward Earth, magical illustration',
            altText: 'Sun sparkles traveling'
          },
          {
            pageNumber: 7,
            text: 'Pip thought that was the most magical thing ever.',
            imagePrompt: 'Pip looking amazed and delighted, eyes wide with wonder',
            altText: 'Pip amazed'
          },
          {
            pageNumber: 8,
            text: 'Every night now he watches for the dancing sky.',
            imagePrompt: 'Pip sitting peacefully on ice looking up at aurora, beautiful peaceful scene',
            altText: 'Watching the night sky'
          }
        ]
      }
    ]
  },
  {
    id: 'tower-adventure',
    title: 'Tower Adventure',
    description: 'Climb high with Lily the brave mouse',
    coverPrompt: 'A tiny brave mouse looking up at a tall magical stone tower with vines and windows, bright sky, fantasy adventure style, child-friendly',
    levels: [
      {
        id: 'tower-1',
        level: 1,
        title: 'Lily Goes Up',
        pages: [
          {
            pageNumber: 1,
            text: 'Lily is a mouse.',
            imagePrompt: 'A small gray mouse with bright eyes and a pink nose standing in grass',
            altText: 'Lily the mouse'
          },
          {
            pageNumber: 2,
            text: 'She sees a big tower.',
            imagePrompt: 'Lily looking up at a tall stone tower reaching into the sky',
            altText: 'Seeing the tower'
          },
          {
            pageNumber: 3,
            text: 'Lily wants to go up.',
            imagePrompt: 'Lily at the base of the tower, determined expression, ready to climb',
            altText: 'Ready to climb'
          },
          {
            pageNumber: 4,
            text: 'She can climb the vine.',
            imagePrompt: 'Lily starting to climb a thick green vine growing up the tower wall',
            altText: 'Climbing the vine'
          },
          {
            pageNumber: 5,
            text: 'Up and up she goes.',
            imagePrompt: 'Lily climbing higher on the vine, tower bricks beside her',
            altText: 'Going up'
          },
          {
            pageNumber: 6,
            text: 'She gets to a window.',
            imagePrompt: 'Lily reaching a stone window opening in the tower, peeking in',
            altText: 'At the window'
          },
          {
            pageNumber: 7,
            text: 'She can see far away.',
            imagePrompt: 'View from the tower window showing fields and trees far below, beautiful',
            altText: 'The view'
          },
          {
            pageNumber: 8,
            text: 'Lily is up high!',
            imagePrompt: 'Lily sitting proudly in the window, happy and accomplished',
            altText: 'Lily up high'
          }
        ]
      },
      {
        id: 'tower-2',
        level: 2,
        title: 'The Secret Room',
        pages: [
          {
            pageNumber: 1,
            text: 'Lily climbed into the tower window.',
            imagePrompt: 'Lily entering through the window into a dim stone room',
            altText: 'Entering the tower'
          },
          {
            pageNumber: 2,
            text: 'Inside she found a dusty old room.',
            imagePrompt: 'Old room with cobwebs, wooden furniture, and dust particles in sunbeams',
            altText: 'Dusty room'
          },
          {
            pageNumber: 3,
            text: 'There was a small wooden door in the wall.',
            imagePrompt: 'Lily discovering a tiny door perfect for a mouse, carved wood',
            altText: 'Finding a small door'
          },
          {
            pageNumber: 4,
            text: 'Lily pushed the door and it opened.',
            imagePrompt: 'Lily pushing the door open with her paws, mysterious light beyond',
            altText: 'Opening the door'
          },
          {
            pageNumber: 5,
            text: 'She found a room full of shiny things!',
            imagePrompt: 'Small room filled with shiny buttons, gems, coins, and treasures, sparkling',
            altText: 'Room of shiny treasures'
          },
          {
            pageNumber: 6,
            text: 'There were buttons and gems and pretty stones.',
            imagePrompt: 'Close-up of colorful gems, buttons, and polished stones glittering',
            altText: 'Treasures close-up'
          },
          {
            pageNumber: 7,
            text: 'Lily picked the most beautiful blue gem.',
            imagePrompt: 'Lily holding a brilliant blue gem up to the light, amazed',
            altText: 'Choosing a gem'
          },
          {
            pageNumber: 8,
            text: 'She took it home as her special treasure.',
            imagePrompt: 'Lily climbing down the vine with the blue gem, sunset sky, accomplished',
            altText: 'Taking treasure home'
          }
        ]
      },
      {
        id: 'tower-3',
        level: 3,
        title: 'The Bird in the Tower',
        pages: [
          {
            pageNumber: 1,
            text: 'Lily went back to the tower the next day.',
            imagePrompt: 'Lily approaching the familiar tower again, morning light',
            altText: 'Returning to the tower'
          },
          {
            pageNumber: 2,
            text: 'This time she climbed even higher than before.',
            imagePrompt: 'Lily climbing past her previous window to higher levels',
            altText: 'Climbing higher'
          },
          {
            pageNumber: 3,
            text: 'At the very top she heard a sad sound.',
            imagePrompt: 'Lily pausing on the vine near the top, listening carefully',
            altText: 'Hearing something'
          },
          {
            pageNumber: 4,
            text: 'A small yellow bird was stuck in the window.',
            imagePrompt: 'A small yellow bird with its wing caught, looking scared and sad',
            altText: 'Bird stuck in window'
          },
          {
            pageNumber: 5,
            text: 'Its wing was caught and it could not fly away.',
            imagePrompt: 'Close-up showing the bird\'s wing trapped, Lily looking concerned',
            altText: 'Trapped wing'
          },
          {
            pageNumber: 6,
            text: 'Lily carefully helped free the wing from the frame.',
            imagePrompt: 'Lily gently helping untangle the bird\'s wing, careful and kind',
            altText: 'Helping the bird'
          },
          {
            pageNumber: 7,
            text: 'The bird flapped its wings and chirped thank you.',
            imagePrompt: 'Bird flying free, happy and grateful, circling around Lily',
            altText: 'Bird freed and happy'
          },
          {
            pageNumber: 8,
            text: 'Lily felt proud that she could help a new friend.',
            imagePrompt: 'Lily and the bird together in the tower window, friendship moment, golden light',
            altText: 'New friendship'
          }
        ]
      }
    ]
  },
  {
    id: 'lantern-quest',
    title: 'Lantern Quest',
    description: 'Light the way with Luna the firefly',
    coverPrompt: 'A glowing firefly with magical light flying through a twilight forest with lanterns hanging from trees, warm enchanted atmosphere, animated style',
    levels: [
      {
        id: 'lantern-1',
        level: 1,
        title: 'Luna Can Glow',
        pages: [
          {
            pageNumber: 1,
            text: 'Luna is a firefly.',
            imagePrompt: 'A cute firefly with big eyes and a glowing tail, twilight background',
            altText: 'Luna the firefly'
          },
          {
            pageNumber: 2,
            text: 'She can glow bright.',
            imagePrompt: 'Luna\'s tail glowing with warm golden light, bright and beautiful',
            altText: 'Luna glowing'
          },
          {
            pageNumber: 3,
            text: 'Luna can fly.',
            imagePrompt: 'Luna flying through the dusky air, wings spread, light trailing',
            altText: 'Luna flying'
          },
          {
            pageNumber: 4,
            text: 'She sees the night.',
            imagePrompt: 'Beautiful twilight sky with first stars appearing, Luna silhouetted',
            altText: 'Night time'
          },
          {
            pageNumber: 5,
            text: 'Luna sees a path.',
            imagePrompt: 'A winding path through a forest, getting dark, Luna hovering above',
            altText: 'Seeing a path'
          },
          {
            pageNumber: 6,
            text: 'The path is dark.',
            imagePrompt: 'Dark shadowy forest path, trees on both sides, needs light',
            altText: 'Dark path'
          },
          {
            pageNumber: 7,
            text: 'Luna can help light it.',
            imagePrompt: 'Luna flying along the path, her glow lighting the way warmly',
            altText: 'Lighting the path'
          },
          {
            pageNumber: 8,
            text: 'Now the path is bright!',
            imagePrompt: 'The path beautifully lit by Luna\'s glow, welcoming and safe, magical',
            altText: 'Bright path'
          }
        ]
      },
      {
        id: 'lantern-2',
        level: 2,
        title: 'The Lost Lantern',
        pages: [
          {
            pageNumber: 1,
            text: 'Luna found a lost lantern on the ground.',
            imagePrompt: 'An old-fashioned lantern lying on its side on the forest floor, no light',
            altText: 'Finding a lantern'
          },
          {
            pageNumber: 2,
            text: 'The lantern was not glowing at all.',
            imagePrompt: 'Luna examining the dark lantern, looking concerned',
            altText: 'Dark lantern'
          },
          {
            pageNumber: 3,
            text: 'She wanted to help it shine again.',
            imagePrompt: 'Luna flying around the lantern thoughtfully, determined',
            altText: 'Wanting to help'
          },
          {
            pageNumber: 4,
            text: 'Luna flew close and touched it gently.',
            imagePrompt: 'Luna touching the lantern with her glowing tail, transferring light',
            altText: 'Touching the lantern'
          },
          {
            pageNumber: 5,
            text: 'Her glow made the lantern start to light up.',
            imagePrompt: 'The lantern beginning to glow faintly with warm light',
            altText: 'Lantern lighting'
          },
          {
            pageNumber: 6,
            text: 'It shined brighter and brighter with golden light.',
            imagePrompt: 'Lantern glowing brightly with beautiful golden light, restored',
            altText: 'Bright lantern'
          },
          {
            pageNumber: 7,
            text: 'Luna hung it back on the old tree branch.',
            imagePrompt: 'Luna hanging the glowing lantern on a tree branch, proud',
            altText: 'Hanging the lantern'
          },
          {
            pageNumber: 8,
            text: 'Now it can guide travelers through the forest.',
            imagePrompt: 'The lantern glowing on the tree, lighting the path, Luna flying nearby, peaceful night',
            altText: 'Guiding light'
          }
        ]
      },
      {
        id: 'lantern-3',
        level: 3,
        title: 'The Festival of Lights',
        pages: [
          {
            pageNumber: 1,
            text: 'Tonight was the special Festival of Lights celebration.',
            imagePrompt: 'Forest clearing with many animals gathering, lanterns being set up, excitement in the air',
            altText: 'Festival beginning'
          },
          {
            pageNumber: 2,
            text: 'All the forest creatures brought their own lanterns.',
            imagePrompt: 'Various animals carrying colorful paper lanterns of different shapes and sizes',
            altText: 'Bringing lanterns'
          },
          {
            pageNumber: 3,
            text: 'But when they tried to light them nothing happened.',
            imagePrompt: 'Animals looking disappointed as their lanterns won\'t light, confused',
            altText: 'Lanterns not lighting'
          },
          {
            pageNumber: 4,
            text: 'The candles had all gone out in the wind.',
            imagePrompt: 'Wind blowing through the clearing, extinguished candles visible',
            altText: 'Wind blowing out candles'
          },
          {
            pageNumber: 5,
            text: 'Luna saw everyone looking sad and had an idea.',
            imagePrompt: 'Luna hovering above, thinking, animals below looking disappointed',
            altText: 'Luna getting an idea'
          },
          {
            pageNumber: 6,
            text: 'She called all her firefly friends to come and help.',
            imagePrompt: 'Many fireflies flying in from all directions, responding to Luna\'s call',
            altText: 'Calling firefly friends'
          },
          {
            pageNumber: 7,
            text: 'Hundreds of fireflies lit up the whole forest together!',
            imagePrompt: 'Magical scene of hundreds of glowing fireflies creating beautiful light display, animals amazed',
            altText: 'Fireflies lighting everything'
          },
          {
            pageNumber: 8,
            text: 'The festival was more beautiful than anyone had dreamed.',
            imagePrompt: 'Spectacular celebration with fireflies and happy animals dancing, most magical night ever',
            altText: 'Beautiful festival'
          }
        ]
      }
    ]
  }
];
