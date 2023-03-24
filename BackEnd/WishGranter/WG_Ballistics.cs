﻿using RatStash;

namespace WishGranter
{
    public class WG_Ballistics
    {
        // Maximum simulation iterations (*SHOULD* be enough for every round in the game)
        private const int _maxIterations = 2000;
        // The time step between each simulation iteration
        private const float _simTimeStep = 0.01f;

        public readonly struct G1DragModel
        {
            public G1DragModel(float mach, float ballist)
            {
                this.Mach = mach;
                this.Ballist = ballist;
            }

            public readonly float Mach { get; }

            public readonly float Ballist { get; }
        }

        private static readonly IReadOnlyList<G1DragModel> G1Coefficents = new List<G1DragModel>
        {
            new G1DragModel(0f, 0.2629f),
            new G1DragModel(0.05f, 0.2558f),
            new G1DragModel(0.1f, 0.2487f),
            new G1DragModel(0.15f, 0.2413f),
            new G1DragModel(0.2f, 0.2344f),
            new G1DragModel(0.25f, 0.2278f),
            new G1DragModel(0.3f, 0.2214f),
            new G1DragModel(0.35f, 0.2155f),
            new G1DragModel(0.4f, 0.2104f),
            new G1DragModel(0.45f, 0.2061f),
            new G1DragModel(0.5f, 0.2032f),
            new G1DragModel(0.55f, 0.202f),
            new G1DragModel(0.6f, 0.2034f),
            new G1DragModel(0.7f, 0.2165f),
            new G1DragModel(0.725f, 0.223f),
            new G1DragModel(0.75f, 0.2313f),
            new G1DragModel(0.775f, 0.2417f),
            new G1DragModel(0.8f, 0.2546f),
            new G1DragModel(0.825f, 0.2706f),
            new G1DragModel(0.85f, 0.2901f),
            new G1DragModel(0.875f, 0.3136f),
            new G1DragModel(0.9f, 0.3415f),
            new G1DragModel(0.925f, 0.3734f),
            new G1DragModel(0.95f, 0.4084f),
            new G1DragModel(0.975f, 0.4448f),
            new G1DragModel(1f, 0.4805f),
            new G1DragModel(1.025f, 0.5136f),
            new G1DragModel(1.05f, 0.5427f),
            new G1DragModel(1.075f, 0.5677f),
            new G1DragModel(1.1f, 0.5883f),
            new G1DragModel(1.125f, 0.6053f),
            new G1DragModel(1.15f, 0.6191f),
            new G1DragModel(1.2f, 0.6393f),
            new G1DragModel(1.25f, 0.6518f),
            new G1DragModel(1.3f, 0.6589f),
            new G1DragModel(1.35f, 0.6621f),
            new G1DragModel(1.4f, 0.6625f),
            new G1DragModel(1.45f, 0.6607f),
            new G1DragModel(1.5f, 0.6573f),
            new G1DragModel(1.55f, 0.6528f),
            new G1DragModel(1.6f, 0.6474f),
            new G1DragModel(1.65f, 0.6413f),
            new G1DragModel(1.7f, 0.6347f),
            new G1DragModel(1.75f, 0.628f),
            new G1DragModel(1.8f, 0.621f),
            new G1DragModel(1.85f, 0.6141f),
            new G1DragModel(1.9f, 0.6072f),
            new G1DragModel(1.95f, 0.6003f),
            new G1DragModel(2f, 0.5934f),
            new G1DragModel(2.05f, 0.5867f),
            new G1DragModel(2.1f, 0.5804f),
            new G1DragModel(2.15f, 0.5743f),
            new G1DragModel(2.2f, 0.5685f),
            new G1DragModel(2.25f, 0.563f),
            new G1DragModel(2.3f, 0.5577f),
            new G1DragModel(2.35f, 0.5527f),
            new G1DragModel(2.4f, 0.5481f),
            new G1DragModel(2.45f, 0.5438f),
            new G1DragModel(2.5f, 0.5397f),
            new G1DragModel(2.6f, 0.5325f),
            new G1DragModel(2.7f, 0.5264f),
            new G1DragModel(2.8f, 0.5211f),
            new G1DragModel(2.9f, 0.5168f),
            new G1DragModel(3f, 0.5133f),
            new G1DragModel(3.1f, 0.5105f),
            new G1DragModel(3.2f, 0.5084f),
            new G1DragModel(3.3f, 0.5067f),
            new G1DragModel(3.4f, 0.5054f),
            new G1DragModel(3.5f, 0.504f),
            new G1DragModel(3.6f, 0.503f),
            new G1DragModel(3.7f, 0.5022f),
            new G1DragModel(3.8f, 0.5016f),
            new G1DragModel(3.9f, 0.501f),
            new G1DragModel(4f, 0.5006f),
            new G1DragModel(4.2f, 0.4998f),
            new G1DragModel(4.4f, 0.4995f),
            new G1DragModel(4.6f, 0.4992f),
            new G1DragModel(4.8f, 0.499f),
            new G1DragModel(5f, 0.4988f)
        };

        public static float CalculateDragCoefficient(float velocity)
        {
            int num = (int)Math.Floor(velocity / 343f / 0.05f);

            if (num <= 0)
            {
                return 0f;
            }

            if (num > G1Coefficents.Count - 1)
            {
                return G1Coefficents.Last().Ballist;
            }

            float num2 = G1Coefficents[num - 1].Mach * 343f;
            float num3 = G1Coefficents[num].Mach * 343f;
            float ballist = G1Coefficents[num - 1].Ballist;

            return (G1Coefficents[num].Ballist - ballist) / (num3 - num2) * (velocity - num2) + ballist;
        }

        public static float GetBulletSpeedAtDistance(float shotDistance, float BulletMassGrams, float BulletDiameterMillimeters, float BallisticCoefficient, float BulletSpeed)
        {
            // Perform calculations based on the bullet properties
            float BW1 = BulletMassGrams * 2f;
            float BDW1 = BulletMassGrams * 0.0014223f / (BulletDiameterMillimeters * BulletDiameterMillimeters * BallisticCoefficient);
            float BDW2 = BulletDiameterMillimeters * BulletDiameterMillimeters * 3.1415927f / 4f;
            float BDW3 = 1.2f * BDW2;

            // Working vars
            float lastDist = 0;
            float lastVel = BulletSpeed;
            float currVel = 0;

            for (int i = 1; i < _maxIterations; i++)
            {
                // Calc drag
                float dragCoef = CalculateDragCoefficient(lastVel) * BDW1;

                // Create offset
                float offset = BDW3 * -dragCoef * lastVel * lastVel / BW1;

                // Set current distance
                float currDist = lastDist + lastVel * _simTimeStep + 5e-05f * offset;
                currVel = lastVel + offset * _simTimeStep;

                if (currDist >= shotDistance)
                {
                    break;
                }
                else
                {
                    lastDist = currDist;
                    lastVel = currVel;
                }
            }

            return currVel;
        }

        public static (float finalDamage, float finalPenetration) GetDamageAndPenetrationAtSpeed(float instantaneousSpeed, float initialSpeed, float initialDamage, float initialPenetration)
        {
            float ratio = Math.Clamp(instantaneousSpeed / initialSpeed, 0, 1);
            float changeFactor = ratio + (1f - ratio) * Math.Clamp(.5f, 0, 1);

            float finalDamage = initialDamage * changeFactor;
            float finalPenetration = initialPenetration * changeFactor;

            return (finalDamage, finalPenetration);
        }
    }
}

