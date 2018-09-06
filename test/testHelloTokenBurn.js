import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';
import { inLogs } from 'zeppelin-solidity/test/helpers/expectEvent';

const TokenSPX = artifacts.require("HelloToken");
var contractTokenSPX;
const BigNumber = web3.BigNumber;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('BurnableToken', function(accounts) {


    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const DECIMALS=18;
    const TOTALTOKENS=(500 * 10 ** 6) * 10 ** DECIMALS;
    const OWNER= accounts[0];
    const RECIPIENT=accounts[1];
    const ANOTHER_ACCOUNT=accounts[2];

    const amount = (30) * 10 ** DECIMALS;
    const from = accounts[0];
    const initialBalance = (500 * 10 ** 6) * 10 ** DECIMALS;

    beforeEach(async function () {
      this.token = await TokenSPX.new();
    });

    describe('when the given amount is not greater than balance of the sender', function () {

      beforeEach(async function () {
        ({ logs: this.logs } = await this.token.burn(amount, { from }));
      });

      it('burns the requested amount', async function () {
        const balance = await this.token.balanceOf(from);
        balance.should.be.bignumber.equal(initialBalance - amount);
      });

      it('emits a burn event', async function () {
        const event = await inLogs(this.logs, 'Burn');
        event.args.from.should.eq(from);
        event.args.value.should.be.bignumber.equal(amount);
      });

      it('emits a transfer event', async function () {
        const event = await inLogs(this.logs, 'Transfer');
        event.args.from.should.eq(from);
        event.args.to.should.eq(ZERO_ADDRESS);
        event.args.value.should.be.bignumber.equal(amount);
      });
    });

    describe('when the given amount is greater than the balance of the sender', function () {
      const amount = (501 * 10 ** 6) * 10 ** DECIMALS;

      it('reverts', async function () {
        await assertRevert(this.token.burn(amount, { from }));
      });
    });

    describe('pause', function () {
      const from = OWNER;
      const amount = (4 * 10 ** 6) * 10 ** DECIMALS;
      describe('when the sender is the token owner', function () {

        describe('when the token is unpaused', function () {
          it('pauses the token', async function (){
            await this.token.pause({ from });
            const paused = await this.token.paused();
            assert.equal(paused, true);
          });
          it('emits a Pause event', async function () {
            const { logs } = await this.token.pause({ from });
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'Pause');
          });
        });

        describe('when the token is paused', function () {

          beforeEach(async function () {
              await this.token.pause();
          });
          it('pause reverts', async function () {
              const paused = await this.token.paused();
              assert.equal(paused, true);
              await assertRevert(this.token.pause({ from }));
          });
          it('burn tokens reverts', async function () {
              const paused = await this.token.paused();
              assert.equal(paused, true);
              await assertRevert(this.token.burn(amount, { from }));
          });
        });
        describe('when the sender is not the token owner', function () {
          const from = ANOTHER_ACCOUNT;

          it('reverts', async function () {
            await assertRevert(this.token.pause({ from }));
          });
        });
      });
    });


    describe('unpause', function () {
        describe('when the sender is the token owner', function () {
          const from = OWNER;

          describe('when the token is paused', function () {
            beforeEach(async function () {
              await this.token.pause({ from });
            });

            it('unpauses the token', async function () {
              await this.token.unpause({ from });

              const paused = await this.token.paused();
              assert.equal(paused, false);
            });

            it('emits an Unpause event', async function () {
              const { logs } = await this.token.unpause({ from });

              assert.equal(logs.length, 1);
              assert.equal(logs[0].event, 'Unpause');
            });
          });

          describe('when the token is unpaused', function () {
            it('reverts', async function () {
              await assertRevert(this.token.unpause({ from }));
            });
          });
        });

        describe('when the sender is not the token owner', function () {
          const from = ANOTHER_ACCOUNT;

          it('reverts', async function () {
            await assertRevert(this.token.unpause({ from }));
          });
        });
      });


      describe('pausable token', function () {
        const from = OWNER;
        describe('paused', function () {
          it('is not paused by default', async function () {
            const paused = await this.token.paused({ from });

            assert.equal(paused, false);
          });

          it('is paused after being paused', async function () {
            await this.token.pause({ from });
            const paused = await this.token.paused({ from });

            assert.equal(paused, true);
          });

          it('is not paused after being paused and then unpaused', async function () {
            await this.token.pause({ from });
            await this.token.unpause({ from });
            const paused = await this.token.paused();

            assert.equal(paused, false);
          });
        });
      });

      describe('transfer', function () {
        const owner = OWNER;
        const recipient=accounts[1]
        it('allows to transfer when unpaused', async function () {
          await this.token.transfer(recipient, TOTALTOKENS, { from: owner });

          const senderBalance = await this.token.balanceOf(owner);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(recipient);
          assert.equal(recipientBalance, TOTALTOKENS);
        });

        it('allows to transfer when paused and then unpaused', async function () {
          await this.token.pause({ from: owner });
          await this.token.unpause({ from: owner });

          await this.token.transfer(recipient, TOTALTOKENS, { from: owner });

          const senderBalance = await this.token.balanceOf(owner);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(recipient);
          assert.equal(recipientBalance, TOTALTOKENS);
        });

        it('reverts when trying to transfer when paused', async function () {
          await this.token.pause({ from: owner });

          await assertRevert(this.token.transfer(recipient, TOTALTOKENS, { from: owner }));
        });
      });

      describe('approve', function () {
        const owner = OWNER;
        const anotherAccount = accounts[2];
        it('allows to approve when unpaused', async function () {
          await this.token.approve(anotherAccount, 40, { from: owner });

          const allowance = await this.token.allowance(owner, anotherAccount);
          assert.equal(allowance, 40);
        });

        it('allows to transfer when paused and then unpaused', async function () {
          await this.token.pause({ from: owner });
          await this.token.unpause({ from: owner });

          await this.token.approve(anotherAccount, 40, { from: owner });

          const allowance = await this.token.allowance(owner, anotherAccount);
          assert.equal(allowance, 40);
        });

        it('reverts when trying to transfer when paused', async function () {
          await this.token.pause({ from: owner });

          await assertRevert(this.token.approve(anotherAccount, 40, { from: owner }));
        });
      });
});
