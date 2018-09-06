import assertRevert from 'zeppelin-solidity/test/helpers/assertRevert';
const TokenSPX = artifacts.require("HelloToken");
var contractTokenSPX;


contract('StandardToken', function(accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const DECIMALS=18;
  const TOTALTOKENS=(500 * 10 ** 6) * 10 ** DECIMALS;
  const OWNER= accounts[0];
  const RECIPIENT=accounts[1];
  const ANOTHER_ACCOUNT=accounts[2];
  beforeEach(async function () {
    this.token = await TokenSPX.new();
  });

  describe('total supply', function () {
    it('returns the total amount of tokens', async function () {
      const totalSupply = await this.token.totalSupply();

      assert.equal(totalSupply, TOTALTOKENS);
    });
  });

  describe('balanceOf', function () {
    describe('when the requested account has no tokens', function () {
      it('returns zero', async function () {
        const balance = await this.token.balanceOf(ANOTHER_ACCOUNT);

        assert.equal(balance, 0);
      });
    });

    describe('when the requested account has some tokens', function () {
      it('returns the total amount of tokens', async function () {
        const balance = await this.token.balanceOf(OWNER);

        assert.equal(balance, TOTALTOKENS);
      });
    });
  });

  describe('transfer', function () {
    describe('when the RECIPIENT is not the zero address', function () {
      const to = RECIPIENT;

      describe('when the sender does not have enough balance', function () {
        const amount = (501 * 10 ** 6) * 10 ** DECIMALS;

        it('reverts', async function () {
          await assertRevert(this.token.transfer(to, amount, { from: OWNER }));
        });
      });

      describe('when the sender has enough balance', function () {
        const amount = TOTALTOKENS;

        it('transfers the requested amount', async function () {
          await this.token.transfer(to, amount, { from: OWNER });

          const senderBalance = await this.token.balanceOf(OWNER);
          assert.equal(senderBalance, 0);

          const RECIPIENTBalance = await this.token.balanceOf(to);
          assert.equal(RECIPIENTBalance, amount);
        });

        it('emits a transfer event', async function () {
          const { logs } = await this.token.transfer(to, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, OWNER);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });
    });

    describe('when the RECIPIENT is the zero address', function () {
      const to = ZERO_ADDRESS;

      it('reverts', async function () {
        await assertRevert(this.token.transfer(to, 100, { from: OWNER }));
      });
    });
  });

  describe('approve', function () {
    describe('when the spender is not the zero address', function () {
      const spender = RECIPIENT;

      describe('when the sender has enough balance', function () {
        const amount = 100;

        it('emits an approval event', async function () {
          const { logs } = await this.token.approve(spender, amount, { from: OWNER });
          console.log(" logs[0]  --"+logs[0].args.from);
          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(amount));
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.approve(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, 1, { from: OWNER });
          });

          it('approves the requested amount and replaces the previous one', async function () {
            await this.token.approve(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const amount = 101;

        it('emits an approval event', async function () {
          const { logs } = await this.token.approve(spender, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(amount));
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.approve(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, 1, { from: OWNER });
          });

          it('approves the requested amount and replaces the previous one', async function () {
            await this.token.approve(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = 100;
      const spender = ZERO_ADDRESS;

      it('approves the requested amount', async function () {
        await this.token.approve(spender, amount, { from: OWNER });

        const allowance = await this.token.allowance(OWNER, spender);
        assert.equal(allowance, amount);
      });

      it('emits an approval event', async function () {
        const { logs } = await this.token.approve(spender, amount, { from: OWNER });

        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Approval');
        assert.equal(logs[0].args.owner, OWNER);
        assert.equal(logs[0].args.spender, spender);
        assert(logs[0].args.value.eq(amount));
      });
    });
  });

  describe('transfer from', function () {
    const spender = RECIPIENT;

    describe('when the RECIPIENT is not the zero address', function () {
      const to = ANOTHER_ACCOUNT;

      describe('when the spender has enough approved balance', function () {
        beforeEach(async function () {
          await this.token.approve(spender, TOTALTOKENS, { from: OWNER });
        });

        describe('when the OWNER has enough balance', function () {
          const amount = TOTALTOKENS;

          it('transfers the requested amount', async function () {
            await this.token.transferFrom(OWNER, to, amount, { from: spender });

            const senderBalance = await this.token.balanceOf(OWNER);
            assert.equal(senderBalance, 0);

            const RECIPIENTBalance = await this.token.balanceOf(to);
            assert.equal(RECIPIENTBalance, amount);
          });

          it('decreases the spender allowance', async function () {
            await this.token.transferFrom(OWNER, to, amount, { from: spender });

            const allowance = await this.token.allowance(OWNER, spender);
            assert(allowance.eq(0));
          });

          it('emits a transfer event', async function () {
            const { logs } = await this.token.transferFrom(OWNER, to, amount, { from: spender });

            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'Transfer');
            assert.equal(logs[0].args.from, OWNER);
            assert.equal(logs[0].args.to, to);
            assert(logs[0].args.value.eq(amount));
          });
        });

        describe('when the OWNER does not have enough balance', function () {
          const amount = (501 * 10 ** 6) * 10 ** DECIMALS;

          it('reverts', async function () {
            await assertRevert(this.token.transferFrom(OWNER, to, amount, { from: spender }));
          });
        });
      });

      describe('when the spender does not have enough approved balance', function () {
        beforeEach(async function () {
          await this.token.approve(spender, 99, { from: OWNER });
        });

        describe('when the OWNER has enough balance', function () {
          const amount = 100;

          it('reverts', async function () {
            await assertRevert(this.token.transferFrom(OWNER, to, amount, { from: spender }));
          });
        });

        describe('when the OWNER does not have enough balance', function () {
          const amount = 101;

          it('reverts', async function () {
            await assertRevert(this.token.transferFrom(OWNER, to, amount, { from: spender }));
          });
        });
      });
    });

    describe('when the RECIPIENT is the zero address', function () {
      const amount = 100;
      const to = ZERO_ADDRESS;

      beforeEach(async function () {
        await this.token.approve(spender, amount, { from: OWNER });
      });

      it('reverts', async function () {
        await assertRevert(this.token.transferFrom(OWNER, to, amount, { from: spender }));
      });
    });
  });

  describe('decrease approval', function () {
    describe('when the spender is not the zero address', function () {
      const spender = RECIPIENT;

      describe('when the sender has enough balance', function () {
        const amount = 100;

        it('emits an approval event', async function () {
          const { logs } = await this.token.decreaseApproval(spender, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(0));
        });

        describe('when there was no approved amount before', function () {
          it('keeps the allowance to zero', async function () {
            await this.token.decreaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, 0);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, amount + 1, { from: OWNER });
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await this.token.decreaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, 1);
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const amount = 101;

        it('emits an approval event', async function () {
          const { logs } = await this.token.decreaseApproval(spender, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(0));
        });

        describe('when there was no approved amount before', function () {
          it('keeps the allowance to zero', async function () {
            await this.token.decreaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, 0);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, amount + 1, { from: OWNER });
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await this.token.decreaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, 1);
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = 100;
      const spender = ZERO_ADDRESS;

      it('decreases the requested amount', async function () {
        await this.token.decreaseApproval(spender, amount, { from: OWNER });

        const allowance = await this.token.allowance(OWNER, spender);
        assert.equal(allowance, 0);
      });

      it('emits an approval event', async function () {
        const { logs } = await this.token.decreaseApproval(spender, amount, { from: OWNER });

        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Approval');
        assert.equal(logs[0].args.owner, OWNER);
        assert.equal(logs[0].args.spender, spender);
        assert(logs[0].args.value.eq(0));
      });
    });
  });

  describe('increase approval', function () {
    const amount = 100;

    describe('when the spender is not the zero address', function () {
      const spender = RECIPIENT;

      describe('when the sender has enough balance', function () {
        it('emits an approval event', async function () {
          const { logs } = await this.token.increaseApproval(spender, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(amount));
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, 1, { from: OWNER });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount + 1);
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const amount = 101;

        it('emits an approval event', async function () {
          const { logs } = await this.token.increaseApproval(spender, amount, { from: OWNER });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, OWNER);
          assert.equal(logs[0].args.spender, spender);
          assert(logs[0].args.value.eq(amount));
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, 1, { from: OWNER });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseApproval(spender, amount, { from: OWNER });

            const allowance = await this.token.allowance(OWNER, spender);
            assert.equal(allowance, amount + 1);
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      const spender = ZERO_ADDRESS;

      it('approves the requested amount', async function () {
        await this.token.increaseApproval(spender, amount, { from: OWNER });

        const allowance = await this.token.allowance(OWNER, spender);
        assert.equal(allowance, amount);
      });

      it('emits an approval event', async function () {
        const { logs } = await this.token.increaseApproval(spender, amount, { from: OWNER });

        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Approval');
        assert.equal(logs[0].args.owner, OWNER);
        assert.equal(logs[0].args.spender, spender);
        assert(logs[0].args.value.eq(amount));
      });
    });
  });
});
