import React, { useState, useEffect } from 'react';
import Card from './Card';
import Toast from './Toast';
import BattleModal from './BattleModal';
import GameOverModal from './GameOverModal';
import GYModal from './GYModal'; 
import { shuffleDeck } from './cardPool';

// Strict local boolean guard to block rapid click mutations or double execution threads
let isResolving = false;

export default function App() {
  const [gameState, setGameState] = useState('COIN_TOSS'); 
  const [currentTurn, setCurrentTurn] = useState(null); 
  const [currentPhase, setCurrentPhase] = useState('DRAW_PHASE'); 
  const [winner, setWinner] = useState(null);
  
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [cardsPlayedThisTurn, setCardsPlayedThisTurn] = useState(0);
  const [isFirstTurnOfGame, setIsFirstTurnOfGame] = useState(true);

  const [p1LP, setP1LP] = useState(4000);
  const [p2LP, setP2LP] = useState(4000);

  const [toastAlert, setToastAlert] = useState(null); 
  const [activeAttackerId, setActiveAttackerId] = useState(null);
  const [activeTargetId, setActiveTargetId] = useState(null);

  const [attackerSelection, setAttackerSelection] = useState(null); 
  const [targetSelection, setTargetSelection] = useState(null); 
  const [battleModal, setBattleModal] = useState(null); 

  const [gyModalData, setGyModalData] = useState({ isOpen: false, ownerName: '', cards: [] });

  const [p1Field, setP1Field] = useState(Array(5).fill(null)); 
  const [p2Field, setP2Field] = useState(Array(5).fill(null));
  const [p1Positions, setP1Positions] = useState(Array(5).fill('ATK')); 
  const [p2Positions, setP2Positions] = useState(Array(5).fill('ATK'));
  const [p1AttackFlags, setP1AttackFlags] = useState(Array(5).fill(false)); 
  const [p2AttackFlags, setP2AttackFlags] = useState(Array(5).fill(false));

  const [p1Deck, setP1Deck] = useState([]);
  const [p1Hand, setP1Hand] = useState([]);
  const [p1Graveyard, setP1Graveyard] = useState([]);
  const [p2Deck, setP2Deck] = useState([]);
  const [p2Hand, setP2Hand] = useState([]);
  const [p2Graveyard, setP2Graveyard] = useState([]);

  const triggerNotice = (message, type = 'info') => setToastAlert({ message, type });

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    if (p1LP <= 0 && p2LP <= 0) { setWinner('DRAW MATCH'); setGameState('GAME_OVER'); }
    else if (p1LP <= 0) { setWinner('Player 2'); setGameState('GAME_OVER'); }
    else if (p2LP <= 0) { setWinner('Player 1'); setGameState('GAME_OVER'); }
  }, [p1LP, p2LP, gameState]);

  const handleResetGame = () => {
    setP1LP(4000); setP2LP(4000);
    setP1Field(Array(5).fill(null)); setP2Field(Array(5).fill(null));
    setP1Graveyard([]); setP2Graveyard([]);
    setWinner(null); setGameState('COIN_TOSS');
    setGyModalData({ isOpen: false, ownerName: '', cards: [] });
    isResolving = false;
  };

  const handleCoinToss = () => {
    const starter = Math.random() < 0.5 ? 'Player 1' : 'Player 2';
    const pool1 = shuffleDeck(); const pool2 = shuffleDeck();
    
    setP1Hand(pool1.slice(0, 3)); setP2Hand(pool2.slice(0, 3));
    setP1Deck(pool1.slice(3, 25)); setP2Deck(pool2.slice(3, 25));
    
    setCurrentTurn(starter); setHasDrawnThisTurn(false); setCardsPlayedThisTurn(0);
    setIsFirstTurnOfGame(true); setGameState('PLAYING'); setCurrentPhase('DRAW_PHASE');
    triggerNotice(`🪙 Coin toss won by ${starter}! 25-Card Decks prepared.`, 'success');
  };

  const handleManualDraw = (player) => {
    if (currentTurn !== player || currentPhase !== 'DRAW_PHASE' || hasDrawnThisTurn) return;
    const deck = player === 'Player 1' ? p1Deck : p2Deck;
    const setDeck = player === 'Player 1' ? setP1Deck : setP2Deck;
    const setHand = player === 'Player 1' ? setP1Hand : setP2Hand;

    if (deck.length === 0) {
      setWinner(player === 'Player 1' ? 'Player 2' : 'Player 1');
      setGameState('GAME_OVER'); triggerNotice(`💀 ${player} has deck out! Game Over.`, 'error');
      return;
    }
    const drawn = deck[0]; 
    setDeck(prev => prev.slice(1)); 
    setHand(prev => [...prev, drawn]);
    setHasDrawnThisTurn(true); setCurrentPhase('MAIN_PHASE');
    triggerNotice(`🃏 ${player} drew ${drawn.name}! Main Phase active.`, 'info');
  };

    const playCardToField = (cardIndex, position) => {
    if (currentPhase !== 'MAIN_PHASE') return;
    if (cardsPlayedThisTurn >= 1) { triggerNotice("Rule Restriction: You can only play 1 monster per turn!", "error"); return; }
    const field = currentTurn === 'Player 1' ? p1Field : p2Field;
    const setField = currentTurn === 'Player 1' ? setP1Field : setP2Field;
    const setPositions = currentTurn === 'Player 1' ? setP1Positions : setP2Positions;
    const hand = currentTurn === 'Player 1' ? p1Hand : p2Hand;
    const setHand = currentTurn === 'Player 1' ? setP1Hand : setP2Hand;

    const emptySlot = field.findIndex(slot => slot === null);
    if (emptySlot === -1) { triggerNotice("Tactical Error: Monster Zones are full!", "error"); return; }
    const targetCard = hand[cardIndex]; const uniqueId = `${targetCard.id}-${Date.now()}`;
    
    setField(prev => { const updated = [...prev]; updated[emptySlot] = { ...targetCard, instanceId: uniqueId }; return updated; });
    setPositions(prev => { const updated = [...prev]; updated[emptySlot] = position; return updated; });
    setHand(prev => prev.filter((_, i) => i !== cardIndex)); setCardsPlayedThisTurn(prev => prev + 1);
    triggerNotice(`⚔️ Summoned ${targetCard.name} in ${position} Position.`, 'success');
  };

  const handleMoveToBattle = () => {
    if (isFirstTurnOfGame) { setCurrentPhase('END_PHASE'); triggerNotice(`🛡️ Turn 1: Skipping Battle Phase. Move to End Phase.`, 'info'); }
    else { setCurrentPhase('BATTLE_PHASE'); triggerNotice(`💥 Battle Phase! Select an ATK monster to strike.`, 'info'); }
  };

  const handleSelectFieldSlot = (slotIndex, slotOwner) => {
    if (currentPhase !== 'BATTLE_PHASE') return;
    const activeField = slotOwner === 'Player 1' ? p1Field : p2Field;
    const activePositions = slotOwner === 'Player 1' ? p1Positions : p2Positions;
    const activeAttackFlags = slotOwner === 'Player 1' ? p1AttackFlags : p2AttackFlags;
    const currentCard = activeField[slotIndex];

    if (!attackerSelection) {
      if (slotOwner !== currentTurn) { triggerNotice("Invalid Target: You can only attack with your own monsters!", "error"); return; }
      if (!currentCard || activePositions[slotIndex] !== 'ATK') return;
      if (activeAttackFlags[slotIndex]) { triggerNotice("Action Lock: This card has already attacked!", "error"); return; }
      setAttackerSelection({ player: currentTurn, slotIndex }); setActiveAttackerId(currentCard.instanceId);
    } else {
      if (slotOwner === currentTurn) {
        if (currentCard && activePositions[slotIndex] === 'ATK' && !activeAttackFlags[slotIndex]) {
          setAttackerSelection({ player: currentTurn, slotIndex }); setActiveAttackerId(currentCard.instanceId);
        }
        return;
      }
      
      const attackerField = currentTurn === 'Player 1' ? p1Field : p2Field;
      const defenderField = currentTurn === 'Player 1' ? p2Field : p1Field;
      const defenderPositions = currentTurn === 'Player 1' ? p2Positions : p1Positions;

      const attackerCard = attackerField[attackerSelection?.slotIndex];
      const defenderCard = defenderField[slotIndex];

      if (!attackerCard || !defenderCard) return;
      setTargetSelection({ player: slotOwner, slotIndex }); setActiveTargetId(defenderCard.instanceId);

      const atkScore = attackerCard.atk;
      const defTargetScore = defenderPositions[slotIndex] === 'ATK' ? defenderCard.atk : defenderCard.def;
      
      let result = 'TIE'; let damageValue = 0; let logText = ''; let targetOfDamage = null;

      if (defenderPositions[slotIndex] === 'ATK') {
        if (atkScore > defTargetScore) { result = 'WIN'; damageValue = atkScore - defTargetScore; targetOfDamage = 'defender'; logText = `${attackerCard.name} destroys ${defenderCard.name}! Opponent takes ${damageValue} battle damage.`; }
        else if (atkScore < defTargetScore) { result = 'LOSE'; damageValue = defTargetScore - atkScore; targetOfDamage = 'attacker'; logText = `${defenderCard.name} overpowers ${attackerCard.name}! You take ${damageValue} battle damage.`; }
        else { result = 'MUTUAL_DESTRUCTION'; logText = `Both cards had identical ${atkScore} ATK and destroyed each other!`; }
      } else {
        if (atkScore > defTargetScore) { result = 'WIN'; logText = `${attackerCard.name} breaks through ${defenderCard.name}'s defenses!`; }
        else if (atkScore < defTargetScore) { result = 'DEF_REFLECT'; damageValue = defTargetScore - atkScore; targetOfDamage = 'attacker'; logText = `${defenderCard.name}'s DEF is too high! You take ${damageValue} LP damage.`; }
        else { result = 'STALEMATE'; logText = `The attack matched DEF exactly. No cards were harmed.`; }
      }

      setTimeout(() => {
        setBattleModal({ attacker: attackerCard, defender: defenderCard, defenderPos: defenderPositions[slotIndex], result, damageValue, targetOfDamage, logText, atkIndex: attackerSelection.slotIndex, defIndex: slotIndex, attackerPlayer: currentTurn });
      }, 200);
    }
  };

  const declareDirectAttack = () => {
    if (currentPhase !== 'BATTLE_PHASE' || !attackerSelection) return;
    const enemyField = currentTurn === 'Player 1' ? p2Field : p1Field;
    const hasMonsters = enemyField.some(slot => slot !== null);
    if (hasMonsters) { triggerNotice("Illegal Action: Cannot attack directly while enemy monsters protect the field!", "error"); return; }
    
    const attackerField = currentTurn === 'Player 1' ? p1Field : p2Field;
    const attackerCard = attackerField[attackerSelection.slotIndex];
    const damageValue = attackerCard.atk;

    setBattleModal({
      attacker: attackerCard, defender: null, defenderPos: 'DIRECT', result: 'WIN', damageValue, targetOfDamage: 'defender',
      logText: `💥 DIRECT ATTACK! ${attackerCard.name} hits the enemy directly for ${damageValue} LP damage!`,
      atkIndex: attackerSelection.slotIndex, defIndex: -1, attackerPlayer: currentTurn
    });
  };

  // LEAK-PROOF RESOLVER ENGINE: Uses strict unique id generation and checks to absolutely prevent duplicates
  const resolveBattleModal = () => {
    if (isResolving || !battleModal) return;
    isResolving = true; 
    
    const { attackerPlayer, atkIndex, defIndex, result, damageValue, targetOfDamage, attacker, defender } = battleModal;
    const setAtkField = attackerPlayer === 'Player 1' ? setP1Field : setP2Field;
    const setDefField = attackerPlayer === 'Player 1' ? setP2Field : setP1Field;
    const setAtkGY = attackerPlayer === 'Player 1' ? setP1Graveyard : setP2Graveyard;
    const setDefGY = attackerPlayer === 'Player 1' ? setP2Graveyard : setP1Graveyard;
    const setAtkAttackFlags = attackerPlayer === 'Player 1' ? setP1AttackFlags : setP2AttackFlags;

    setBattleModal(null);
    setAttackerSelection(null); 
    setTargetSelection(null); 
    setActiveAttackerId(null); 
    setActiveTargetId(null); 

    if (damageValue > 0 && targetOfDamage) {
      const updateLP = targetOfDamage === 'defender' ? (attackerPlayer === 'Player 1' ? setP2LP : setP1LP) : (attackerPlayer === 'Player 1' ? setP1LP : setP2LP);
      updateLP(prev => Math.max(0, prev - damageValue));
    }

    const uniqueStamp = `${Date.now()}-${Math.round(Math.random() * 100000)}`;

    if (result === 'WIN' && defIndex !== -1) {
      setDefGY(prevGY => {
        // Double verification check inside the state array loop
        if (prevGY.some(c => c.instanceId === defender.instanceId)) return prevGY;
        return [...prevGY, { ...defender, instanceId: `${defender.id}-gy-${uniqueStamp}` }];
      });
      setDefField(prev => { const f = [...prev]; f[defIndex] = null; return f; });
    } else if (result === 'LOSE') {
      setAtkGY(prevGY => {
        if (prevGY.some(c => c.instanceId === attacker.instanceId)) return prevGY;
        return [...prevGY, { ...attacker, instanceId: `${attacker.id}-gy-${uniqueStamp}` }];
      });
      setAtkField(prev => { const f = [...prev]; f[atkIndex] = null; return f; });
    } else if (result === 'MUTUAL_DESTRUCTION') {
      setAtkGY(prevGY => {
        if (prevGY.some(c => c.instanceId === attacker.instanceId)) return prevGY;
        return [...prevGY, { ...attacker, instanceId: `${attacker.id}-gy-${uniqueStamp}` }];
      });
      setDefGY(prevGY => {
        if (prevGY.some(c => c.instanceId === defender.instanceId)) return prevGY;
        return [...prevGY, { ...defender, instanceId: `${defender.id}-gy-${uniqueStamp}` }];
      });
      setAtkField(prev => { const f = [...prev]; f[atkIndex] = null; return f; });
      setDefField(prev => { const f = [...prev]; f[defIndex] = null; return f; });
    }

    setAtkAttackFlags(prev => { const flags = [...prev]; flags[atkIndex] = true; return flags; });
    setTimeout(() => { isResolving = false; }, 120);
  };

  const endTurn = () => {
    setP1AttackFlags(Array(5).fill(false)); setP2AttackFlags(Array(5).fill(false));
    setAttackerSelection(null); setTargetSelection(null); setActiveAttackerId(null); setActiveTargetId(null);
    setHasDrawnThisTurn(false); setCardsPlayedThisTurn(0); setIsFirstTurnOfGame(false); 
    const nextPlayer = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
    setCurrentTurn(nextPlayer); setCurrentPhase('DRAW_PHASE');
    triggerNotice(`🔄 Turn Passed! It is now ${nextPlayer}'s Draw Phase.`, 'info');
  };

    return (
    <>
      <GameOverModal winner={winner} onRestart={handleResetGame} />
      <BattleModal battleModal={battleModal} onProceed={resolveBattleModal} />
      
      <GYModal 
        isOpen={gyModalData.isOpen} 
        ownerName={gyModalData.ownerName} 
        cards={gyModalData.cards} 
        onClose={() => setGyModalData({ isOpen: false, ownerName: '', cards: [] })} 
      />

      <div className="min-h-screen bg-slate-900 text-slate-100 p-2 w-full max-w-none px-4 flex flex-col justify-between relative select-none">
        
        <header className="text-center border-b border-slate-800 pb-1 flex justify-between items-center px-2 bg-slate-950/40 p-2 rounded-xl mb-1 w-full relative z-20">
          <div className="text-left">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Player 2 LP</div>
            <div className="text-md font-mono font-black text-red-400 tracking-wider">❤️ {p2LP} HP</div>
          </div>
          {gameState === 'PLAYING' && (
            <div className="flex gap-4 items-center">
              <div className="text-[10px] text-slate-400 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                Turn: <span className="text-amber-400 font-bold">{currentTurn}</span> | Phase: <span className="text-emerald-400 font-bold">{currentPhase.replace('_', ' ')}</span>
              </div>
              {currentPhase === 'MAIN_PHASE' && <button onClick={handleMoveToBattle} className="bg-amber-600 text-slate-950 font-bold text-[10px] px-2 py-1 rounded hover:bg-amber-500 cursor-pointer transition">Move to Battle</button>}
              {currentPhase === 'BATTLE_PHASE' && !(currentTurn === 'Player 1' ? p2Field : p1Field).some(s => s !== null) && attackerSelection && (
                <button onClick={declareDirectAttack} className="bg-orange-600 text-white font-bold text-[10px] px-2 py-1 rounded hover:bg-orange-500 animate-pulse cursor-pointer">⚡ Direct Attack</button>
              )}
              {(currentPhase === 'BATTLE_PHASE' || currentPhase === 'END_PHASE') && <button onClick={endTurn} className="bg-red-600 text-white font-bold text-[10px] px-4 py-1 rounded hover:bg-red-500 cursor-pointer transition">EndTurn</button>}
            </div>
          )}
          <div className="text-right">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Player 1 LP</div>
            <div className="text-md font-mono font-black text-emerald-400 tracking-wider">❤️ {p1LP} HP</div>
          </div>
        </header>

        {gameState === 'COIN_TOSS' && (
          <div className="my-auto text-center py-12 bg-slate-800 border border-slate-700 rounded-xl max-w-sm mx-auto w-full p-4 shadow-xl"><button onClick={handleCoinToss} className="bg-amber-500 text-slate-950 text-xs px-6 py-2.5 rounded font-black hover:bg-amber-400 cursor-pointer">✨ INITIATE COIN DUEL</button></div>
        )}

        {gameState === 'PLAYING' && (
          <div className="flex flex-col gap-2 my-2 flex-grow justify-center w-full relative">
            
            {/* Renders portal message context cleanly left-aligned beneath Player 2's status display card */}
            <Toast toastAlert={toastAlert} onClose={() => setToastAlert(null)} />

            {/* Player 2 Hand Stack */}
            <div className="flex items-center justify-between gap-4 bg-slate-800/20 p-2 rounded border border-slate-800 w-full">
              <div className="flex gap-1 flex-grow justify-center min-h-[120px] items-center">{p2Hand.map((card, i) => <Card key={i} card={card} faceDown={currentTurn !== 'Player 2'} interactive={currentTurn === 'Player 2' && currentPhase === 'MAIN_PHASE'} onPlayATK={() => playCardToField(i, 'ATK')} onPlayDEF={() => playCardToField(i, 'DEF')} />)}</div>
              <div 
                onClick={() => setGyModalData({ isOpen: true, ownerName: 'Player 2', cards: p2Graveyard })}
                className="w-20 h-28 bg-red-950 border border-red-700 rounded-lg flex flex-col justify-between p-2 items-center select-none shadow hover:border-amber-500 hover:scale-105 transition duration-200 cursor-pointer"
              >
                <div className="text-[8px] text-slate-400 font-bold">DECK</div>
                <div onClick={(e) => { e.stopPropagation(); handleManualDraw('Player 2'); }} className={`text-lg font-black text-amber-500 w-full text-center rounded bg-slate-900/40 p-0.5 ${currentTurn === 'Player 2' && currentPhase === 'DRAW_PHASE' && !hasDrawnThisTurn ? 'animate-pulse bg-amber-500 text-slate-950' : ''}`}>{p2Deck.length}</div>
                <div className="text-[8px] bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded text-red-400 font-bold tracking-tight">GY: {p2Graveyard.length}</div>
              </div>
            </div>

            {/* Core Battlefield Arena Field Mat */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-6 relative shadow-inner my-1 w-full z-10">
              <div className="grid grid-cols-5 gap-4 max-w-none w-full justify-items-center">{p2Field.map((card, i) => <div key={`p2-slot-${i}`} className="relative"><Card card={card} faceDown={card ? p2Positions[i] === 'DEF' : false} onClick={card ? () => handleSelectFieldSlot(i, 'Player 2') : undefined} isAttacking={card && card.instanceId === activeAttackerId} isTargeted={card && card.instanceId === activeTargetId} />{card && <span className={`absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded font-bold text-white shadow ${p2Positions[i] === 'ATK' ? 'bg-red-600' : 'bg-blue-600'}`}>{p2Positions[i]}</span>}{card && p2AttackFlags[i] && <span className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-[10px] font-black text-red-500 tracking-wider z-10">USED</span>}</div>)}</div>
              <div className="w-full border-b border-dashed border-slate-800 relative flex justify-center"><span className="absolute -top-2 bg-slate-950 px-4 text-[9px] text-slate-500 tracking-widest font-mono">BATTLEFIELD GRID AREA</span></div>
              <div className="grid grid-cols-5 gap-4 max-w-none w-full justify-items-center">{p1Field.map((card, i) => <div key={`p1-slot-${i}`} className="relative"><Card card={card} faceDown={card ? p1Positions[i] === 'DEF' : false} onClick={card ? () => handleSelectFieldSlot(i, 'Player 1') : undefined} isAttacking={card && card.instanceId === activeAttackerId} isTargeted={card && card.instanceId === activeTargetId} />{card && <span className={`absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded font-bold text-white shadow ${p1Positions[i] === 'ATK' ? 'bg-red-600' : 'bg-blue-600'}`}>{p1Positions[i]}</span>}{card && p1AttackFlags[i] && <span className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-[10px] font-black text-red-500 tracking-wider z-10">USED</span>}</div>)}</div>
            </div>

            {/* Player 1 Hand Stack */}
            <div className="flex items-center justify-between gap-4 bg-slate-800/20 p-2 rounded border border-slate-800 w-full">
              <div className="flex gap-1 flex-grow justify-center min-h-[112px] items-center">{p1Hand.map((card, i) => <Card key={i} card={card} faceDown={currentTurn !== 'Player 1'} interactive={currentTurn === 'Player 1' && currentPhase === 'MAIN_PHASE'} onPlayATK={() => playCardToField(i, 'ATK')} onPlayDEF={() => playCardToField(i, 'DEF')} />)}</div>
              <div 
                onClick={() => setGyModalData({ isOpen: true, ownerName: 'Player 1', cards: p1Graveyard })}
                className="w-20 h-28 bg-red-950 border border-red-700 rounded-lg flex flex-col justify-between p-2 items-center select-none shadow hover:border-amber-500 hover:scale-105 transition duration-200 cursor-pointer"
              >
                <div className="text-[8px] text-slate-400 font-bold">DECK</div>
                <div onClick={(e) => { e.stopPropagation(); handleManualDraw('Player 1'); }} className={`text-lg font-black text-amber-500 w-full text-center rounded bg-slate-900/40 p-0.5 ${currentTurn === 'Player 1' && currentPhase === 'DRAW_PHASE' && !hasDrawnThisTurn ? 'animate-pulse bg-amber-500 text-slate-950' : ''}`}>{p1Deck.length}</div>
                <div className="text-[8px] bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold tracking-tight">GY: {p1Graveyard.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
