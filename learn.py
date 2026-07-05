# learn_cognee.py
# Cognee ke sabhi concepts step by step seekhte hain
# Ek ek function run karo aur output dekho

import asyncio
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
import cognee

# ══════════════════════════════════════════
# SETUP — Pehle yeh hamesha karna hai
# ══════════════════════════════════════════

async def setup():
    os.environ["LLM_API_KEY"]                   = os.getenv("GROQ_API_KEY", "")
    os.environ["LLM_MODEL"]                     = "groq/llama-3.1-8b-instant"
    os.environ["LLM_PROVIDER"]                  = "openai"
    os.environ["OPENAI_API_KEY"]                = os.getenv("GROQ_API_KEY", "")
    os.environ["OPENAI_API_BASE"]               = "https://api.groq.com/openai/v1"
    os.environ["GRAPH_DATABASE_PROVIDER"]       = "ladybug"
    os.environ["VECTOR_DB_PROVIDER"]            = "lancedb"
    os.environ["ENABLE_BACKEND_ACCESS_CONTROL"] = "false"
    os.environ["COGNEE_SKIP_CONNECTION_TEST"]   = "true"
    print("✅ Cognee Groq via OpenAI compat Setup Done!")
# ══════════════════════════════════════════
# LESSON 1 — remember() kya karta hai?
# Text ko permanent memory mein save karta hai
# ══════════════════════════════════════════

async def lesson1_remember():
    print("\n📚 LESSON 1: remember()")
    print("-" * 40)

    await cognee.remember(
        "My name is Ravi. I run a tiffin service in Jaspur, Uttarakhand. "
        "I have 40 daily customers. My main problem is high delivery cost.",
        dataset_name="ravi_business"
    )
    print("✅ Info saved to memory!")
    print("   Dataset name: 'ravi_business'")
    print("   Cognee ne yeh text ko graph + vector mein store kar liya")

# ══════════════════════════════════════════
# LESSON 2 — recall() kya karta hai?
# Saved memory se relevant info nikalta hai
# ══════════════════════════════════════════

async def lesson2_recall():
    print("\n📚 LESSON 2: recall()")
    print("-" * 40)

    # Simple query
    result = await cognee.recall(
        "What is my business problem?",
        datasets=["ravi_business"]
    )
    print("Query: 'What is my business problem?'")
    print("Result:", result)
    print()

    # Alag query same dataset se
    result2 = await cognee.recall(
        "How many customers do I have?",
        datasets=["ravi_business"]
    )
    print("Query: 'How many customers?'")
    print("Result:", result2)

# ══════════════════════════════════════════
# LESSON 3 — Multiple remember() calls
# Alag alag info add karte jao same dataset mein
# ══════════════════════════════════════════

async def lesson3_multiple_remember():
    print("\n📚 LESSON 3: Multiple remember() calls")
    print("-" * 40)

    # Pehli info
    await cognee.remember(
        "My business revenue is Rs 25,000 per month.",
        dataset_name="ravi_business"
    )
    print("✅ Revenue info added")

    # Doosri info
    await cognee.remember(
        "I tried WhatsApp marketing last week. Got 3 new customers.",
        dataset_name="ravi_business"
    )
    print("✅ Marketing info added")

    # Teesri info
    await cognee.remember(
        "My goal this week is to reduce delivery cost by 20 percent.",
        dataset_name="ravi_business"
    )
    print("✅ Goal info added")

    # Ab sab ek saath recall karo
    result = await cognee.recall(
        "What are my business goals and revenue?",
        datasets=["ravi_business"]
    )
    print("\nRecall result (sab info ek saath):")
    print(result)

# ══════════════════════════════════════════
# LESSON 4 — session_id kya hai?
# Short term memory — ek session ki baatein
# ══════════════════════════════════════════

async def lesson4_sessions():
    print("\n📚 LESSON 4: Session Memory")
    print("-" * 40)

    # Session memory — self_improvement=False matlab abhi graph mein mat daalo
    await cognee.remember(
        "Today Ravi said he is worried about monsoon affecting deliveries.",
        dataset_name="ravi_business",
        session_id="session_001",
        self_improvement=False   # sirf session mein rakho abhi
    )
    print("✅ Session memory saved (session_001)")
    print("   Yeh abhi permanent graph mein NAHI hai")
    print("   improve() call karne ke baad permanent banega")

# ══════════════════════════════════════════
# LESSON 5 — improve() kya karta hai?
# Session memory ko permanent graph mein daalta hai
# ══════════════════════════════════════════

async def lesson5_improve():
    print("\n📚 LESSON 5: improve()")
    print("-" * 40)

    print("Before improve — session memory permanent nahi hai")

    await cognee.improve(
        dataset="ravi_business",
        session_ids=["session_001"]
    )
    print("✅ improve() done!")
    print("   Ab session_001 ki baatein permanent memory mein aa gayi")

    # Ab recall karo
    result = await cognee.recall(
        "What is Ravi worried about?",
        datasets=["ravi_business"]
    )
    print("\nRecall after improve:")
    print(result)

# ══════════════════════════════════════════
# LESSON 6 — forget() kya karta hai?
# Dataset delete karta hai
# ══════════════════════════════════════════

async def lesson6_forget():
    print("\n📚 LESSON 6: forget()")
    print("-" * 40)

    # Pehle ek test dataset banao
    await cognee.remember(
        "This is test data that we will delete.",
        dataset_name="test_delete_me"
    )
    print("✅ Test data saved in 'test_delete_me'")

    # Ab delete karo
    await cognee.forget(dataset="test_delete_me")
    print("✅ Dataset deleted!")
    print("   'test_delete_me' ab exist nahi karta")

# ══════════════════════════════════════════
# LESSON 7 — Multiple Datasets
# Alag alag users ke liye alag datasets
# ══════════════════════════════════════════

async def lesson7_multiple_datasets():
    print("\n📚 LESSON 7: Multiple Datasets")
    print("-" * 40)

    # User 1
    await cognee.remember(
        "Ravi runs a tiffin service. Problem: delivery cost.",
        dataset_name="user_ravi_business"
    )

    # User 2
    await cognee.remember(
        "Priya runs a clothing shop. Problem: low footfall.",
        dataset_name="user_priya_business"
    )

    print("✅ Two separate user datasets created")

    # Ravi ka data
    ravi = await cognee.recall(
        "What is the main problem?",
        datasets=["user_ravi_business"]
    )
    print("\nRavi ka data:", ravi)

    # Priya ka data
    priya = await cognee.recall(
        "What is the main problem?",
        datasets=["user_priya_business"]
    )
    print("Priya ka data:", priya)
    print("\n✅ Dono users ka data alag alag hai!")

# ══════════════════════════════════════════
# MAIN — Sab lessons ek ek chalao
# ══════════════════════════════════════════

async def main():
    await setup()

    # Ek ek karke safely run karte hain, taaki crash na ho
    try:
        await lesson1_remember()
    except Exception as e:
        print(f"❌ Lesson 1 Failed: {e}")

    try:
        await lesson2_recall()
    except Exception as e:
        print(f"❌ Lesson 2 Failed: {e}")

    try:
        await lesson3_multiple_remember()
    except Exception as e:
        print(f"❌ Lesson 3 Failed: {e}")

    try:
        await lesson4_sessions()
    except Exception as e:
        print(f"❌ Lesson 4 Failed: {e}")

    try:
        await lesson5_improve()
    except Exception as e:
        print(f"❌ Lesson 5 Failed: {e}")

    try:
        await lesson6_forget()
    except Exception as e:
        print(f"❌ Lesson 6 Failed: {e}")

    try:
        await lesson7_multiple_datasets()
    except Exception as e:
        print(f"❌ Lesson 7 Failed: {e}")

    print("\n" + "="*40)
    print("🎉 Pipeline Execution Attempted!")
    print("="*40)

if __name__ == "__main__":
    asyncio.run(main())