import type { GameMap } from 'src/entities/GameMap';

import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

import { Timeout } from 'src/controllers/Timeout';

import { TILE_SIZE, WEAPONS } from 'src/constants/config';

import type { Vertex } from 'src/types';

export type ActorParams = {
  position: Actor['_position'];
  health: Actor['_health'];
  maxHealth: Actor['_maxHealth'];
  currentWeapon: Actor['_currentWeapon'];
  angle: Actor['_angle'];
  rawValue: Actor['_rawValue'];
  emitter: Actor['_emitter'];
  gameMap: Actor['_gameMap'];
};

export abstract class Actor {
  protected _emitter: EventEmitter;
  protected _health: number;
  protected _maxHealth: number;
  protected _horizontalSpeed: number;
  protected _verticalSpeed: number;
  protected _currentWeapon: keyof typeof WEAPONS;
  protected _isAttacking: boolean;
  protected _position: Vertex;
  protected _angle: number;
  protected _attackTimeout: Timeout;
  protected _rawValue: string | number;
  protected _gameMap: GameMap | null;

  protected constructor(params: ActorParams) {
    this._currentWeapon = params.currentWeapon;
    this._health = params.health;
    this._maxHealth = params.maxHealth;
    this._position = params.position;
    this._angle = params.angle;
    this._rawValue = params.rawValue;
    this._gameMap = params.gameMap;
    this._emitter = params.emitter;

    this._attackTimeout = new Timeout(params.emitter);
    this._isAttacking = false;
    this._horizontalSpeed = 0;
    this._verticalSpeed = 0;

    this.registerActorEvents();
  }

  private registerActorEvents() {
    this._emitter.on('gameMapReady', (gameMap) => {
      this._gameMap = gameMap;
    });
  }

  get angle() {
    return this._angle;
  }

  get position() {
    return this._position;
  }

  get currentMatrixPosition() {
    return {
      x: Math.floor(this._position.x / TILE_SIZE),
      y: Math.floor(this._position.y / TILE_SIZE),
    };
  }
}
