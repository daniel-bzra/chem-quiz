/* ------------------------------------------------------------------
   ChemRevise - question bank
   Content is based on the BWZ chemistry course script (chapters C1-C9).

   Each question object:
     id        unique id, also used for the video file name
     topic     chapter key (must exist in QUIZ_TOPICS)
     question  the question text (English, level B2)
     options   4 answer options
     correct   index of the correct option
     why       short note for EVERY option: why it is right / wrong
     takeaway  the one sentence a learner should remember
     video     path or URL of the explanation video (shown when wrong)
     source    where the content comes from
   ------------------------------------------------------------------ */

const QUIZ_TOPICS = {
  C1: { name: "Substances &amp; properties", colour: "#0ea5e9" },
  C2: { name: "Structure of matter",         colour: "#6366f1" },
  C3: { name: "Chemical bonding",            colour: "#8b5cf6" },
  C4: { name: "Amount of substance",         colour: "#d946ef" },
  C5: { name: "Chemical reactions",          colour: "#f43f5e" },
  C6: { name: "Intermolecular forces",       colour: "#f97316" },
  C7: { name: "Acids &amp; bases",           colour: "#eab308" },
  C8: { name: "Redox reactions",             colour: "#22c55e" },
  C9: { name: "Organic chemistry",           colour: "#14b8a6" }
};

const SCRIPT = "BWZ chemistry course script <em>CHEM IMST24a</em>";

const QUIZ_QUESTIONS = [
  /* ---------------------------------------------------------- C1 */
  {
    id: "q01",
    topic: "C1",
    question: "A beaker contains sand, table salt and water. Which procedure separates all three components from each other?",
    options: [
      "Filter the mixture, then let the water evaporate from the filtrate.",
      "Let the water evaporate first, then filter the dry solid.",
      "Distil the mixture once and collect the distillate.",
      "Pull the sand out with a magnet, then filter off the salt."
    ],
    correct: 0,
    why: [
      "Correct. Filtration holds back the undissolved sand. The salt is dissolved, so it passes through with the water and stays behind as a solid when the water evaporates.",
      "Once the water is gone, salt and sand are two dry solids in the same beaker. Filtration only separates a solid from a liquid, so the two powders stay mixed.",
      "Distillation gives you pure water, but sand and salt both stay behind in the flask. You have separated one component out of three.",
      "Sand is silicon dioxide and is not magnetic, so the magnet picks up nothing. The salt is dissolved and would pass through a filter anyway."
    ],
    takeaway: "Pick the separation method that uses a property in which the components really differ: solubility for the salt, particle size for the sand.",
    video: "videos/q01.mp4",
    source: SCRIPT + ", chapter C1 &ndash; Trennung von Gemischen"
  },
  {
    id: "q02",
    topic: "C1",
    question: "Which observation is the strongest evidence that a clear, colourless liquid is a pure substance and not a mixture?",
    options: [
      "You can see straight through it.",
      "Its temperature stays constant during the whole boiling process.",
      "Its density is exactly 1.00 g/cm&sup3;.",
      "It leaves no residue on filter paper."
    ],
    correct: 1,
    why: [
      "Salt water, vinegar and spirits are all perfectly transparent. Transparency says nothing about purity.",
      "Correct. A pure substance has one fixed boiling temperature. A mixture boils over a temperature <em>range</em>, because the component with the lower boiling point evaporates first.",
      "A single density value can never prove purity. You can mix a salt solution to almost any density you like, including 1.00 g/cm&sup3;.",
      "A filter only holds back <em>undissolved</em> particles. Everything that is dissolved passes straight through, so a salt solution also passes this test."
    ],
    takeaway: "Fixed melting and boiling temperatures are the fingerprint of a pure substance.",
    video: "videos/q02.mp4",
    source: SCRIPT + ", chapter C1 &ndash; Reine Stoffe und Gemische"
  },

  /* ---------------------------------------------------------- C2 */
  {
    id: "q03",
    topic: "C2",
    question: "In the gold-foil experiment by Rutherford almost all alpha particles flew straight through the foil, but a very small number bounced back. What is the correct conclusion?",
    options: [
      "The mass and the positive charge of an atom sit in a tiny nucleus, and the rest of the atom is almost empty space.",
      "The atom is a uniform positive sphere with the electrons stuck inside it.",
      "The electrons of the shell pushed the alpha particles back.",
      "Gold atoms are radioactive and fired the particles back."
    ],
    correct: 0,
    why: [
      "Correct. Straight through means mostly empty space. A few very strong deflections mean a tiny, dense, positively charged nucleus that repels the positive alpha particles.",
      "That was the older plum-pudding picture. If the positive charge were spread out evenly, every alpha particle would be deflected slightly and none would come back.",
      "Electrons are roughly 7000 times lighter than an alpha particle, so they cannot bounce one back, just as a ping-pong ball cannot stop a bowling ball. They are also negative and would attract, not repel.",
      "Gold is not radioactive, and the foil is passive here. The source of the alpha particles stands outside the foil."
    ],
    takeaway: "A rare but extreme deflection can only come from a very small, very dense, positively charged centre.",
    video: "videos/q03.mp4",
    source: SCRIPT + ", chapter C2 &ndash; Der Streuversuch von Rutherford"
  },
  {
    id: "q04",
    topic: "C2",
    question: "Sodium and potassium stand in the same group of the periodic table and both react violently with water. Which statement explains this similarity best?",
    options: [
      "They contain the same number of protons.",
      "They have the same relative atomic mass.",
      "They have the same number of electrons in their outermost shell.",
      "They stand in the same period of the periodic table."
    ],
    correct: 2,
    why: [
      "Two atoms with the same number of protons would be the <em>same</em> element. Sodium has 11, potassium has 19.",
      "Sodium has about 23 u and potassium about 39 u, so the masses are clearly different. Mass is not what decides chemical behaviour.",
      "Correct. Both stand in group 1 and have exactly one valence electron. That single electron is given away easily, which produces Na&#8314; and K&#8314; and the violent reaction with water.",
      "They share a <em>group</em> (a column), not a period (a row). Sodium is in period 3, potassium in period 4."
    ],
    takeaway: "Chemical behaviour is decided by the valence electrons, and that is why a group of the periodic table behaves like a family.",
    video: "videos/q04.mp4",
    source: SCRIPT + ", chapter C2 &ndash; Die Elektronenh&uuml;lle der Atome, Periodensystem"
  },

  /* ---------------------------------------------------------- C3 */
  {
    id: "q05",
    topic: "C3",
    question: "Solid sodium chloride does not conduct electricity, but molten sodium chloride conducts very well. Why?",
    options: [
      "In the solid the ions are locked in the crystal lattice, and in the melt they can move freely.",
      "Melting converts the ions into free electrons.",
      "The solid contains no charged particles, and melting is what creates the ions.",
      "The hot salt reacts with the oxygen of the air, and the products conduct."
    ],
    correct: 0,
    why: [
      "Correct. An electric current needs <em>mobile</em> charge carriers. The Na&#8314; and Cl&#8315; ions already exist in the solid, but they are held in fixed positions. Melting breaks up the lattice and sets them free.",
      "Melting is a physical change: it separates particles, it does not turn ions into electrons. In salts the charge is carried by ions, not by free electrons, which is the picture for metals.",
      "The ions are there the whole time. Sodium chloride is <em>built</em> from Na&#8314; and Cl&#8315;, and that is exactly what makes it a salt.",
      "No reaction with the air takes place, and even if it did it would not explain why the melt conducts while the solid does not."
    ],
    takeaway: "Conductivity needs charge carriers that are free to move, so salts conduct only when molten or dissolved.",
    video: "videos/q05.mp4",
    source: SCRIPT + ", chapter C3 &ndash; Salze, Atomverb&auml;nde aus Nichtmetall- und Metallatomen"
  },
  {
    id: "q06",
    topic: "C3",
    question: "Nitrogen forms the molecule NH&#8323;, but never a neutral NH&#8322; or NH&#8324; molecule. Which reasoning explains this?",
    options: [
      "Nitrogen has 3 protons, so it can bind 3 hydrogen atoms.",
      "A nitrogen atom has 5 valence electrons and needs 3 shared electrons to reach an octet, so it forms 3 bonds and keeps one lone pair.",
      "A hydrogen atom can form two bonds, so only three hydrogen atoms fit around the nitrogen.",
      "NH&#8323; is simply the lightest possible combination of nitrogen and hydrogen."
    ],
    correct: 1,
    why: [
      "Nitrogen has 7 protons. The element with 3 protons is lithium. The number of bonds is decided by the valence electrons, not by the protons.",
      "Correct. 5 valence electrons plus 3 shared electrons make 8. Nitrogen therefore draws exactly three bonding pairs and keeps one lone pair, which also explains the pyramidal shape of ammonia.",
      "Hydrogen has a single electron and reaches a full shell with two electrons, so it forms exactly <em>one</em> bond. That is true for every hydrogen atom in every molecule.",
      "Being light is not a rule of chemistry. NH&#8322; would leave nitrogen one electron short of an octet, which is why it exists only as a short-lived fragment."
    ],
    takeaway: "Count the valence electrons and fill up to eight: that number tells you how many bonds an atom forms.",
    video: "videos/q06.mp4",
    source: SCRIPT + ", chapter C3 &ndash; Lewis-Formel, Oktettregel"
  },

  /* ---------------------------------------------------------- C4 */
  {
    id: "q07",
    topic: "C4",
    question: "How heavy are 500 litres of ammonia gas (NH&#8323;) at standard conditions (0&nbsp;&deg;C, 1013&nbsp;hPa)? Use V<sub>m</sub>&nbsp;=&nbsp;22.4&nbsp;L/mol and M(NH&#8323;)&nbsp;=&nbsp;17.0&nbsp;g/mol.",
    options: [
      "about 22 g",
      "about 380 g",
      "about 660 g",
      "about 8500 g"
    ],
    correct: 1,
    why: [
      "22.3 is the amount of substance <em>n</em> in mol, not a mass. You still have to multiply by the molar mass.",
      "Correct. n = V / V<sub>m</sub> = 500 L / 22.4 L per mol = 22.3 mol. m = n &middot; M = 22.3 mol &middot; 17.0 g/mol, which is about 380 g.",
      "This value comes from dividing by the wrong number. Always check the units: litres divided by litres per mol gives mol, and mol times g/mol gives grams.",
      "This is 500 &middot; 17.0, so the volume was treated as if it were an amount of substance. The molar volume of 22.4 L/mol is the step that turns litres into moles."
    ],
    takeaway: "Gas volume to moles: divide by 22.4 L/mol. Moles to mass: multiply by M.",
    video: "videos/q07.mp4",
    source: SCRIPT + ", chapter C4 &ndash; Molare Masse und Molvolumen"
  },
  {
    id: "q08",
    topic: "C4",
    question: "4.0&nbsp;g of sodium hydroxide (NaOH, M&nbsp;=&nbsp;40.0&nbsp;g/mol) are dissolved in water, and the solution is made up to 500&nbsp;mL. What is c(NaOH)?",
    options: [
      "0.10 mol/L",
      "0.20 mol/L",
      "2.0 mol/L",
      "8.0 mol/L"
    ],
    correct: 1,
    why: [
      "0.10 mol is the <em>amount of substance</em> you dissolved. Because it sits in only half a litre, the concentration is twice that number.",
      "Correct. n = m / M = 4.0 g / 40.0 g per mol = 0.10 mol. c = n / V = 0.10 mol / 0.500 L = 0.20 mol/L.",
      "Here the volume was used as 0.050 L. Watch the decimal point: 500 mL are 0.500 L.",
      "This is 4.0 g / 0.500 L. A concentration in mol/L needs the amount of substance in moles, so you must divide the mass by the molar mass first."
    ],
    takeaway: "c = n / V, and V is always in litres, so convert the millilitres before you divide.",
    video: "videos/q08.mp4",
    source: SCRIPT + ", chapter C4 &ndash; Die Stoffmengenkonzentration"
  },

  /* ---------------------------------------------------------- C5 */
  {
    id: "q09",
    topic: "C5",
    question: "A balloon holds 16.8&nbsp;L of hydrogen and 8.4&nbsp;L of oxygen at standard conditions. A spark starts the reaction. How much water is formed? (V<sub>m</sub>&nbsp;=&nbsp;22.4&nbsp;L/mol, M(H&#8322;O)&nbsp;=&nbsp;18.0&nbsp;g/mol)",
    options: [
      "6.8 g",
      "13.5 g",
      "18.0 g",
      "27.0 g"
    ],
    correct: 1,
    why: [
      "This is the amount of oxygen turned into a mass. The equation tells you that <em>two</em> water molecules form per oxygen molecule.",
      "Correct. 2 H&#8322; + O&#8322; &rarr; 2 H&#8322;O. n(H&#8322;) = 16.8/22.4 = 0.750 mol and n(O&#8322;) = 8.4/22.4 = 0.375 mol, which is exactly the 2:1 ratio, so nothing is left over. n(H&#8322;O) = 0.750 mol gives m = 13.5 g. Check: 1.5 g of hydrogen plus 12.0 g of oxygen make 13.5 g.",
      "18.0 g would be exactly 1 mol of water. The balanced equation gives 0.750 mol here, not 1 mol.",
      "This is twice the correct value, because the 2 in front of H&#8322;O was applied a second time. That coefficient is already contained in n(H&#8322;O) = n(H&#8322;)."
    ],
    takeaway: "Balance first, convert volumes into moles, then use the coefficients as a ratio. Mass is always conserved, so use that as your check.",
    video: "videos/q09.mp4",
    source: SCRIPT + ", chapter C5 &ndash; Reaktionsgleichungen und Mengenangaben (Knallgasreaktion)"
  },
  {
    id: "q10",
    topic: "C5",
    question: "A catalyst is added to a chemical reaction. Which statement is correct?",
    options: [
      "It is used up during the reaction and has to be replaced regularly.",
      "It makes the reaction release more energy.",
      "It lowers the activation energy, so more collisions are successful, and it is unchanged at the end.",
      "It turns an endothermic reaction into an exothermic one."
    ],
    correct: 2,
    why: [
      "A catalyst takes part in the mechanism but is released again afterwards. That is exactly why a very small amount of it can convert huge quantities of reactants.",
      "The energy difference between the reactants and the products is fixed by the substances themselves. A catalyst changes only the <em>path</em>, never the start and end points.",
      "Correct. The catalyst offers a route with a lower activation energy, so more particles have enough energy to react. The reaction runs faster, or already at a lower temperature, and the catalyst is recovered unchanged.",
      "Whether a reaction releases or needs energy is decided by the reactants and products. A catalyst cannot reverse that; it only makes the existing reaction faster."
    ],
    takeaway: "A catalyst changes the speed, never the energy balance, and it comes out of the reaction unchanged.",
    video: "videos/q10.mp4",
    source: SCRIPT + ", chapter C5 &ndash; Chemische Reaktion und Energie, Wirkung eines Katalysators"
  },

  /* ---------------------------------------------------------- C6 */
  {
    id: "q11",
    topic: "C6",
    question: "Chloromethane (CH&#8323;Cl, M&nbsp;=&nbsp;50.5&nbsp;g/mol) boils at &minus;23.8&nbsp;&deg;C, methanol (CH&#8324;O, M&nbsp;=&nbsp;32.0&nbsp;g/mol) boils at +65&nbsp;&deg;C. Why does the <em>lighter</em> molecule boil at the much higher temperature?",
    options: [
      "Methanol molecules form hydrogen bonds through their O&ndash;H group, and these are far stronger than the dipole&ndash;dipole forces between chloromethane molecules.",
      "The C&ndash;O bond inside methanol is stronger and has to be broken during boiling.",
      "Chloromethane is a non-polar molecule, so only weak van der Waals forces act between its molecules.",
      "Methanol molecules are heavier and are therefore harder to lift into the gas phase."
    ],
    correct: 0,
    why: [
      "Correct. The hydrogen atom sits directly on an oxygen atom, which is the condition for a hydrogen bond. These extra strong dipole&ndash;dipole interactions have to be overcome during boiling, and that costs a lot of energy.",
      "Boiling only separates molecules from each other. It never breaks the covalent bonds <em>inside</em> a molecule, and the methanol that evaporates is still CH&#8324;O.",
      "The C&ndash;Cl bond is clearly polar, so chloromethane <em>is</em> a dipole and does have dipole&ndash;dipole forces. They are simply much weaker than hydrogen bonds.",
      "The molar masses are given in the question, and methanol with 32.0 g/mol is the lighter one. That is precisely why the answer cannot be the mass."
    ],
    takeaway: "Boiling temperature depends on the forces <em>between</em> molecules. An O&ndash;H or N&ndash;H group in the formula means hydrogen bonds and a high boiling point.",
    video: "videos/q11.mp4",
    source: SCRIPT + ", chapter C6 &ndash; Zwischenmolekulare Kr&auml;fte und Siedepunkte"
  },
  {
    id: "q12",
    topic: "C6",
    question: "Chlorine (Cl&#8322;) is a completely non-polar molecule, yet it becomes a liquid at &minus;34.6&nbsp;&deg;C. Which force holds the molecules together?",
    options: [
      "Hydrogen bonds",
      "Ionic attraction between Cl&#8314; and Cl&#8315;",
      "Permanent dipole&ndash;dipole interaction",
      "Van der Waals forces caused by a short-lived, uneven distribution of the electrons"
    ],
    correct: 3,
    why: [
      "A hydrogen bond needs a hydrogen atom bound to oxygen, nitrogen or fluorine. Cl&#8322; contains no hydrogen at all.",
      "Chlorine gas consists of neutral Cl&#8322; molecules, not of ions. Ions would only form with a partner of very different electronegativity, such as sodium.",
      "A permanent dipole needs a difference in electronegativity. Both atoms in Cl&#8322; are chlorine, so the difference is zero and there is no permanent dipole.",
      "Correct. The electrons keep moving, so for a tiny moment the charge is spread unevenly and the molecule becomes a temporary dipole. This induces the same in its neighbour, which gives a weak but real attraction, and it is the reason why every substance can be liquefied if you cool it far enough."
    ],
    takeaway: "Van der Waals forces act between <em>all</em> particles, even non-polar ones. They are weak, which is why non-polar substances boil at low temperatures.",
    video: "videos/q12.mp4",
    source: SCRIPT + ", chapter C6 &ndash; van der Waals-Kr&auml;fte (Glossar)"
  },

  /* ---------------------------------------------------------- C7 */
  {
    id: "q13",
    topic: "C7",
    question: "Solution A has pH&nbsp;3 and solution B has pH&nbsp;6. How much higher is the oxonium ion concentration c(H&#8323;O&#8314;) in A compared with B?",
    options: [
      "2 times higher",
      "3 times higher",
      "1000 times higher",
      "1000 times lower"
    ],
    correct: 2,
    why: [
      "The pH scale is not a doubling scale. One pH unit always means a factor of ten.",
      "Subtracting the pH values gives you the number of <em>steps</em>, which is 3, but not the factor. Each of those steps is itself a factor of 10.",
      "Correct. pH 3 means c(H&#8323;O&#8314;) = 10&#8315;&sup3; mol/L and pH 6 means 10&#8315;&#8310; mol/L. The ratio is 10&#8315;&sup3; divided by 10&#8315;&#8310;, which is 10&sup3; = 1000.",
      "The direction is inverted. The <em>lower</em> the pH, the more acidic the solution and the higher c(H&#8323;O&#8314;), so A is the more acidic one."
    ],
    takeaway: "The pH scale is logarithmic: one unit means a factor of 10, and a small pH means a large H&#8323;O&#8314; concentration.",
    video: "videos/q13.mp4",
    source: SCRIPT + ", chapter C7 &ndash; pH-Skala, pH-Werte berechnen"
  },
  {
    id: "q14",
    topic: "C7",
    question: "25.0&nbsp;mL of sodium hydroxide solution with c&nbsp;=&nbsp;0.100&nbsp;mol/L is exactly neutralised with hydrochloric acid of c&nbsp;=&nbsp;0.200&nbsp;mol/L. Which volume of acid is needed?<br>NaOH + HCl &rarr; NaCl + H&#8322;O",
    options: [
      "12.5 mL",
      "25.0 mL",
      "50.0 mL",
      "6.25 mL"
    ],
    correct: 0,
    why: [
      "Correct. n(NaOH) = 0.0250 L &middot; 0.100 mol/L = 2.50 mmol. The equation is 1:1, so n(HCl) = 2.50 mmol as well, and V = n / c = 2.50 mmol / 0.200 mol/L = 12.5 mL. The acid is twice as concentrated, so half the volume is needed, which fits.",
      "Equal volumes would only be correct if both solutions had the <em>same</em> concentration. Here the acid is twice as concentrated.",
      "This is the ratio the wrong way round. A more concentrated acid needs <em>less</em> volume, not more.",
      "Here the factor 2 was used twice. Do the calculation in two clean steps: first n(NaOH), then V(HCl) = n / c."
    ],
    takeaway: "At the neutralisation point n(acid) = n(base) for a 1:1 reaction, so work with amounts of substance and never with volumes alone.",
    video: "videos/q14.mp4",
    source: SCRIPT + ", chapter C7 &ndash; Neutralisationsreaktionen, Konzentrationsangaben"
  },

  /* ---------------------------------------------------------- C8 */
  {
    id: "q15",
    topic: "C8",
    question: "What is the oxidation number of chromium in the dichromate ion, Cr&#8322;O&#8327;&sup2;&#8315;?",
    options: [
      "+III",
      "+VI",
      "+VII",
      "+XII"
    ],
    correct: 1,
    why: [
      "+III is the oxidation number of chromium in Cr&sup3;&#8314; or in Cr&#8322;O&#8323;. Here the seven oxygen atoms force a much higher value.",
      "Correct. Oxygen is &minus;II, so 7 &middot; (&minus;2) = &minus;14. The whole ion carries &minus;2, therefore 2x &minus; 14 = &minus;2, which gives 2x = +12 and x = +VI per chromium atom.",
      "+VII belongs to manganese in the permanganate ion MnO&#8324;&#8315;. Do not mix the two up, and count the atoms every time.",
      "+12 is the total for <em>both</em> chromium atoms. An oxidation number always refers to a single atom, so you still have to divide by 2."
    ],
    takeaway: "Oxidation numbers must add up to the charge of the particle, so set up the small equation and remember to divide by the number of atoms.",
    video: "videos/q15.mp4",
    source: SCRIPT + ", chapter C8 &ndash; Oxidationszahlen bestimmen"
  },
  {
    id: "q16",
    topic: "C8",
    question: "A zinc strip is dipped into copper(II) sulfate solution, and at the same time a copper strip is dipped into zinc sulfate solution. What do you observe?",
    options: [
      "Both strips become coated with the other metal.",
      "The copper strip becomes coated with zinc, and nothing happens to the zinc strip.",
      "The zinc strip becomes coated with copper and the blue colour fades, and nothing happens to the copper strip.",
      "Nothing happens in either beaker."
    ],
    correct: 2,
    why: [
      "A redox reaction runs in one direction only, namely the one that is energetically favourable. If both directions ran at once you would have a perpetual motion machine.",
      "This is the reaction the wrong way round. Copper is the more noble metal and holds on to its electrons, so it does not hand them over to Zn&sup2;&#8314;.",
      "Correct. Zinc is the less noble metal and therefore the stronger reducing agent: Zn + Cu&sup2;&#8314; &rarr; Zn&sup2;&#8314; + Cu. The copper is deposited as a red-brown layer and the blue Cu&sup2;&#8314; disappears from the solution. The reverse reaction does not take place.",
      "Something clearly does happen in the first beaker. This is the classic experiment used to demonstrate the electrochemical series."
    ],
    takeaway: "The less noble metal gives up its electrons, so looking up both metals in the electrochemical series already decides the direction of the reaction.",
    video: "videos/q16.mp4",
    source: SCRIPT + ", chapter C8 &ndash; Die elektrochemische Spannungsreihe (Leitprogramm)"
  },

  /* ---------------------------------------------------------- C9 */
  {
    id: "q17",
    topic: "C9",
    question: "Butane and 2-methylpropane both have the molecular formula C&#8324;H&#8321;&#8320;, but butane boils at &minus;0.5&nbsp;&deg;C and 2-methylpropane at &minus;11.7&nbsp;&deg;C. Which explanation is correct?",
    options: [
      "2-methylpropane is lighter and therefore evaporates more easily.",
      "Butane can form hydrogen bonds and 2-methylpropane cannot.",
      "2-methylpropane contains a double bond and is therefore more volatile.",
      "They are constitutional isomers: the branched molecule is more compact, so neighbouring molecules touch over a smaller area and the van der Waals forces are weaker."
    ],
    correct: 3,
    why: [
      "The same molecular formula means the same molar mass, 58 g/mol for both, so the difference cannot come from the mass.",
      "Hydrogen bonds need a hydrogen atom on oxygen, nitrogen or fluorine. Both molecules contain only carbon and hydrogen, so neither of them forms hydrogen bonds.",
      "C&#8324;H&#8321;&#8320; is saturated. With 4 carbon atoms and a double bond the formula would be C&#8324;H&#8328;, so both molecules contain single bonds only.",
      "Correct. Same formula but different structure means isomers. The long, straight butane molecules lie against each other like pencils and touch over a large area, while the branched, ball-shaped 2-methylpropane has less contact area, weaker van der Waals forces and therefore a lower boiling point."
    ],
    takeaway: "More branching means less contact area, weaker van der Waals forces and a lower boiling temperature.",
    video: "videos/q17.mp4",
    source: SCRIPT + ", chapter C9 &ndash; Benennung einfacher organischer Molek&uuml;le, Isomerie"
  },
  {
    id: "q18",
    topic: "C9",
    question: "In the human body ethanol (C&#8322;H&#8325;OH) is broken down in two oxidation steps. Which sequence is correct?",
    options: [
      "ethanol &rarr; ethanal (acetaldehyde) &rarr; ethanoic acid (acetic acid)",
      "ethanol &rarr; ethanoic acid &rarr; ethanal",
      "ethanol &rarr; ethene &rarr; ethane",
      "ethanol &rarr; methanol &rarr; methanal"
    ],
    correct: 0,
    why: [
      "Correct. A primary alcohol is oxidised first to an aldehyde and then to a carboxylic acid. The intermediate ethanal is far more toxic than ethanol itself and is largely responsible for the symptoms of a hangover.",
      "The order is reversed. The carboxylic acid is the <em>end</em> of the chain, the more strongly oxidised stage, and it is not turned back into an aldehyde.",
      "Turning ethanol into ethene would be an elimination of water rather than an oxidation, and no oxygen would be involved at all.",
      "The carbon skeleton stays intact during this breakdown. Oxidation changes the functional group, it does not cut a C&ndash;C bond and shorten the chain."
    ],
    takeaway: "Oxidation of a primary alcohol goes alcohol &rarr; aldehyde &rarr; carboxylic acid, and each step adds oxygen or removes hydrogen.",
    video: "videos/q18.mp4",
    source: SCRIPT + ", chapter C9 &ndash; Ethanol: Eigenschaften und Wirkungen"
  }
];
